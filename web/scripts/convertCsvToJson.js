#!/usr/bin/env node

/**
 * convertCsvToJson.js
 * 
 * Converts summary_by_activity.csv from the C++ analysis into
 * processedMotionData.json for the Next.js frontend.
 * 
 * Usage:
 *   node scripts/convertCsvToJson.js
 */

const fs = require('fs')
const path = require('path')

// File paths
const csvPath = path.resolve(__dirname, '../../summary_by_activity.csv')
const outputPath = path.resolve(__dirname, '../public/processedMotionData.json')

/**
 * Parse CSV file with headers
 */
function parseCsv(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.trim().split('\n')
  
  if (lines.length < 2) {
    throw new Error('CSV file is empty or missing data')
  }

  const headers = lines[0].split(',').map(h => h.trim())
  const rows = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    const row = {}
    
    headers.forEach((header, idx) => {
      row[header] = isNaN(values[idx]) ? values[idx] : parseFloat(values[idx])
    })
    
    rows.push(row)
  }

  return rows
}

/**
 * Normalize a value to a target range [min, max]
 */
function normalize(value, min, max, targetMin = 0, targetMax = 1) {
  if (value <= min) return targetMin
  if (value >= max) return targetMax
  return targetMin + ((value - min) / (max - min)) * (targetMax - targetMin)
}

/**
 * Compute derived animation parameters from metrics
 */
function computeAnimationParams(row) {
  const avgPeakAcc = row['Avg_Peak_Acc']
  const avgPeakGyro = row['Avg_Peak_Gyro']
  const avgSmoothness = row['Avg_Smoothness']
  const avgReps = row['Avg_Reps']
  const activity = row['Activity']

  // Thresholds for motion classification
  const dynamicThreshold = 0.2
  const motionType = avgPeakAcc > dynamicThreshold ? 'dynamic' : 'static'

  // Normalize cadence from gyro magnitude (0-2.5 range -> 0.2-1.5)
  const cadence = normalize(avgPeakGyro, 0, 2.5, 0.3, 1.5)

  // Normalize amplitude from peak acceleration (0-1.2 range -> 0.1-1.0)
  const amplitude = normalize(avgPeakAcc, 0, 1.2, 0.1, 1.0)

  // Map smoothness to animation factor (inverse: higher smoothness = lower jerk)
  // avgSmoothness range: 0-0.09 approximately
  const smoothnessFactor = 1 - Math.min(avgSmoothness * 20, 1.0)

  // Activity-specific parameters
  let posture = 'upright'
  let kneeLift = 0.0
  let downwardStepBias = 0.0
  let armSwing = 0.05

  switch (activity) {
    case 'WALKING':
      posture = 'upright'
      kneeLift = 0.0
      downwardStepBias = 0.0
      armSwing = 0.3
      break
    case 'WALKING_UPSTAIRS':
      posture = 'upright'
      kneeLift = 0.3
      downwardStepBias = 0.0
      armSwing = 0.4
      break
    case 'WALKING_DOWNSTAIRS':
      posture = 'upright'
      kneeLift = 0.0
      downwardStepBias = 0.3
      armSwing = 0.5
      break
    case 'SITTING':
      posture = 'seated'
      kneeLift = 0.0
      downwardStepBias = 0.0
      armSwing = 0.05
      break
    case 'STANDING':
      posture = 'upright'
      kneeLift = 0.0
      downwardStepBias = 0.0
      armSwing = 0.05
      break
    case 'LAYING':
      posture = 'horizontal'
      kneeLift = 0.0
      downwardStepBias = 0.0
      armSwing = 0.02
      break
  }

  return {
    activity: row['Activity'],
    label: row['Label'],
    avgPeakAcceleration: avgPeakAcc,
    avgPeakGyro: avgPeakGyro,
    avgSmoothness: avgSmoothness,
    avgReps: avgReps,
    inferredCadence: cadence,
    inferredAmplitude: amplitude,
    motionType: motionType,
    posture: posture,
    kneeLift: kneeLift,
    downwardStepBias: downwardStepBias,
    armSwing: armSwing,
  }
}

/**
 * Main conversion function
 */
function convertCsvToJson() {
  try {
    console.log(`Reading CSV from: ${csvPath}`)
    
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found: ${csvPath}`)
    }

    const rows = parseCsv(csvPath)
    console.log(`Parsed ${rows.length} activities from CSV`)

    const motionData = rows.map(row => computeAnimationParams(row))

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Write JSON file
    fs.writeFileSync(outputPath, JSON.stringify(motionData, null, 2), 'utf-8')
    console.log(`✓ Generated ${outputPath}`)
    console.log(`✓ JSON contains ${motionData.length} activities`)

    // Print summary
    console.log('\nActivity Summary:')
    motionData.forEach(data => {
      console.log(`  ${data.activity}: ${data.motionType} - cadence: ${data.inferredCadence.toFixed(2)}, amplitude: ${data.inferredAmplitude.toFixed(2)}`)
    })

  } catch (error) {
    console.error('Error converting CSV to JSON:', error.message)
    process.exit(1)
  }
}

// Run conversion
convertCsvToJson()