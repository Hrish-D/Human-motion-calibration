'use client'

import { useState, useEffect } from 'react'
import StickFigure from '../components/StickFigure'

interface MotionData {
  activity: string
  label: number
  avgPeakAcceleration: number
  avgPeakGyro: number
  avgSmoothness: number
  avgReps: number
  inferredCadence: number
  inferredAmplitude: number
  motionType: 'dynamic' | 'static'
  posture: 'upright' | 'seated' | 'horizontal'
  kneeLift: number
  downwardStepBias: number
  armSwing: number
}

export default function Home() {
  const [motionData, setMotionData] = useState<MotionData[]>([])
  const [selectedActivity, setSelectedActivity] = useState<string>('WALKING')

  useEffect(() => {
    fetch('/processedMotionData.json')
      .then(res => res.json())
      .then(data => setMotionData(data))
  }, [])

  const currentData = motionData.find(d => d.activity === selectedActivity) || motionData[0]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">HAR Rehab Motion Analysis Demo</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Activity Selection</h2>
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              >
                {motionData.map(data => (
                  <option key={data.activity} value={data.activity}>
                    {data.activity}
                  </option>
                ))}
              </select>

              <p className="text-sm text-gray-600">
                Animation is always driven by processed motion metrics from sensor data.
              </p>
            </div>

            {/* How interpretation is generated */}
            <div className="bg-white p-6 rounded-lg shadow mt-4">
              <h3 className="text-lg font-semibold mb-3">How Interpretation is Generated</h3>
              <ul className="text-sm space-y-2">
                <li>• Acceleration magnitude influences intensity and limb swing</li>
                <li>• Gyroscope magnitude influences movement speed/cadence</li>
                <li>• Smoothness influences fluidity of animation</li>
                <li>• Rep count or periodicity influences rhythm</li>
              </ul>
            </div>
          </div>

          {/* Animation */}
          <div className="lg:col-span-1 flex justify-center">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-center">Motion Animation</h2>
              {currentData && (
                <StickFigure
                  motionType={currentData.motionType}
                  cadence={currentData.inferredCadence}
                  amplitude={currentData.inferredAmplitude}
                  smoothness={1 - currentData.avgSmoothness * 20}
                  kneeLift={currentData.kneeLift}
                  armSwing={currentData.armSwing}
                  posture={currentData.posture}
                  downwardStepBias={currentData.downwardStepBias}
                />
              )}
            </div>
          </div>

          {/* Metrics and Charts */}
          <div className="lg:col-span-1">
            {currentData && (
              <>
                {/* Raw Metrics */}
                <div className="bg-white p-6 rounded-lg shadow mb-4">
                  <h3 className="text-lg font-semibold mb-3">Raw Metrics</h3>
                  <div className="space-y-2 text-sm">
                    <div>Avg Peak Acc: {currentData.avgPeakAcceleration.toFixed(3)}</div>
                    <div>Avg Peak Gyro: {currentData.avgPeakGyro.toFixed(3)}</div>
                    <div>Avg Smoothness: {currentData.avgSmoothness.toFixed(3)}</div>
                    <div>Avg Reps: {currentData.avgReps.toFixed(3)}</div>
                  </div>
                </div>

                {/* Mapped Parameters */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-3">Mapped Animation Parameters</h3>
                  <div className="space-y-2 text-sm">
                    <div>Cadence: {currentData.inferredCadence.toFixed(2)}</div>
                    <div>Amplitude: {currentData.inferredAmplitude.toFixed(2)}</div>
                    <div>Motion Type: {currentData.motionType}</div>
                    <div>Posture: {currentData.posture}</div>
                    {currentData.kneeLift > 0 && <div>Knee Lift: {currentData.kneeLift.toFixed(2)}</div>}
                    {currentData.downwardStepBias > 0 && <div>Downward Bias: {currentData.downwardStepBias.toFixed(2)}</div>}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}