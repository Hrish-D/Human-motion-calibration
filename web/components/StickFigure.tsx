'use client'

import { useEffect, useState } from 'react'

interface StickFigureProps {
  motionType: 'dynamic' | 'static'
  cadence: number
  amplitude: number
  smoothness: number
  kneeLift: number
  armSwing: number
  posture: 'upright' | 'seated' | 'horizontal'
  downwardStepBias: number
}

// Joint positions and angles for the skeleton
interface Joint {
  x: number
  y: number
}

interface Skeleton {
  head: Joint
  neck: Joint
  shoulders: Joint
  leftShoulder: Joint
  rightShoulder: Joint
  leftElbow: Joint
  rightElbow: Joint
  leftWrist: Joint
  rightWrist: Joint
  hips: Joint
  leftHip: Joint
  rightHip: Joint
  leftKnee: Joint
  rightKnee: Joint
  leftAnkle: Joint
  rightAnkle: Joint
}

export default function StickFigure({
  motionType,
  cadence,
  amplitude,
  smoothness,
  kneeLift,
  armSwing,
  posture,
  downwardStepBias
}: StickFigureProps) {
  const [phase, setPhase] = useState(0)
  const [microPhase, setMicroPhase] = useState(0)

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(prev => (prev + cadence * 0.1) % (2 * Math.PI))
      setMicroPhase(prev => (prev + 0.02) % (2 * Math.PI)) // Very slow micro-motion
    }, 50)
    return () => clearInterval(interval)
  }, [cadence])

  // Compute skeleton based on posture and motion
  const computeSkeleton = (): Skeleton => {
    // Body base and posture adjustments
    const baseX = 100
    let baseY = 50
    let torsoAngle = 0 // For horizontal posture
    let hipOffset = 0
    let kneeBendStatic = 0

    if (posture === 'seated') {
      baseY = 80
      hipOffset = 30 // Lower hips more for sitting
      kneeBendStatic = 0.4 // More bent legs for seated
    } else if (posture === 'horizontal') {
      baseY = 120
      torsoAngle = Math.PI / 3 // More tilted for lying down (60 degrees)
      hipOffset = 15
    }

    // Body sway and bob for dynamic motion only
    const sway = motionType === 'dynamic' ? Math.sin(phase * 0.5) * amplitude * 6 : Math.sin(microPhase) * 0.5 // Subtle micro-sway for static
    const bob = motionType === 'dynamic' ? Math.abs(Math.sin(phase)) * amplitude * 4 : Math.sin(microPhase * 0.5) * 0.3 // Subtle micro-bob

    // Smoothness factor modulates swing amplitudes
    const smoothFactor = Math.max(0.35, Math.min(1, smoothness))

    // Downward bias for walking downstairs - more visible effect
    const downwardBias = downwardStepBias * 0.5 // Increased for clearer effect

    // Initialize skeleton with base positions
    const skeleton: Skeleton = {
      head: { x: baseX + sway, y: baseY + bob },
      neck: { x: baseX + sway, y: baseY + 20 + bob },
      shoulders: { x: baseX + sway, y: baseY + 25 + bob },
      leftShoulder: { x: baseX - 15 + sway, y: baseY + 25 + bob },
      rightShoulder: { x: baseX + 15 + sway, y: baseY + 25 + bob },
      leftElbow: { x: 0, y: 0 },
      rightElbow: { x: 0, y: 0 },
      leftWrist: { x: 0, y: 0 },
      rightWrist: { x: 0, y: 0 },
      hips: { x: baseX + sway * 0.5, y: baseY + 80 + bob * 0.5 + hipOffset },
      leftHip: { x: baseX - 10 + sway * 0.5, y: baseY + 80 + bob * 0.5 + hipOffset },
      rightHip: { x: baseX + 10 + sway * 0.5, y: baseY + 80 + bob * 0.5 + hipOffset },
      leftKnee: { x: 0, y: 0 },
      rightKnee: { x: 0, y: 0 },
      leftAnkle: { x: 0, y: 0 },
      rightAnkle: { x: 0, y: 0 }
    }

    // Apply torso angle for horizontal posture
    if (posture === 'horizontal') {
      const cosT = Math.cos(torsoAngle)
      const sinT = Math.sin(torsoAngle)
      // Rotate hips and shoulders around neck
      const dxH = skeleton.hips.x - skeleton.neck.x
      const dyH = skeleton.hips.y - skeleton.neck.y
      skeleton.hips.x = skeleton.neck.x + dxH * cosT - dyH * sinT
      skeleton.hips.y = skeleton.neck.y + dxH * sinT + dyH * cosT
      skeleton.leftHip.x = skeleton.hips.x - 10
      skeleton.leftHip.y = skeleton.hips.y
      skeleton.rightHip.x = skeleton.hips.x + 10
      skeleton.rightHip.y = skeleton.hips.y
    }

    // Arm motion
    const armSwingAngle = motionType === 'dynamic'
      ? Math.sin(phase + Math.PI) * armSwing * smoothFactor * Math.PI / 3
      : Math.sin(microPhase * 0.3) * 0.1 // Very subtle arm micro-motion for static

    const armLength = 25
    skeleton.leftElbow.x = skeleton.leftShoulder.x + Math.cos(armSwingAngle) * armLength * 0.6
    skeleton.leftElbow.y = skeleton.leftShoulder.y + Math.sin(armSwingAngle) * armLength * 0.6
    skeleton.leftWrist.x = skeleton.leftElbow.x + Math.cos(armSwingAngle) * armLength * 0.4
    skeleton.leftWrist.y = skeleton.leftElbow.y + Math.sin(armSwingAngle) * armLength * 0.4

    skeleton.rightElbow.x = skeleton.rightShoulder.x + Math.cos(-armSwingAngle) * armLength * 0.6
    skeleton.rightElbow.y = skeleton.rightShoulder.y + Math.sin(-armSwingAngle) * armLength * 0.6
    skeleton.rightWrist.x = skeleton.rightElbow.x + Math.cos(-armSwingAngle) * armLength * 0.4
    skeleton.rightWrist.y = skeleton.rightElbow.y + Math.sin(-armSwingAngle) * armLength * 0.4

    // Leg motion
    const legLength = 35

    if (motionType === 'dynamic') {
      // Step-like motion for dynamic activities
      const leftRaw = Math.sin(phase)
      const leftSwing = leftRaw > 0
        ? Math.pow(leftRaw, 1.5)   // lifting phase
        : leftRaw * 0.5            // grounded phase
      const leftAngle = leftSwing * amplitude * smoothFactor * Math.PI / 4 + downwardBias

      const rightRaw = Math.sin(phase + Math.PI)
      const rightSwing = rightRaw > 0
        ? Math.pow(rightRaw, 1.5)
        : rightRaw * 0.5
      const rightAngle = rightSwing * amplitude * smoothFactor * Math.PI / 4 + downwardBias

      // Left leg
      const leftKneeBend = Math.max(0, leftRaw) * (0.5 + kneeLift)
      skeleton.leftKnee.x = skeleton.leftHip.x + Math.sin(leftAngle) * legLength * 0.5
      skeleton.leftKnee.y = skeleton.leftHip.y + Math.cos(leftAngle) * legLength * 0.5
      skeleton.leftAnkle.x = skeleton.leftKnee.x + Math.sin(leftAngle + leftKneeBend) * legLength * 0.5
      skeleton.leftAnkle.y = skeleton.leftKnee.y + Math.cos(leftAngle + leftKneeBend) * legLength * 0.5 + downwardBias * 2 // Extra downward for ankles

      // Right leg
      const rightKneeBend = Math.max(0, rightRaw) * (0.5 + kneeLift)
      skeleton.rightKnee.x = skeleton.rightHip.x + Math.sin(rightAngle) * legLength * 0.5
      skeleton.rightKnee.y = skeleton.rightHip.y + Math.cos(rightAngle) * legLength * 0.5
      skeleton.rightAnkle.x = skeleton.rightKnee.x + Math.sin(rightAngle + rightKneeBend) * legLength * 0.5
      skeleton.rightAnkle.y = skeleton.rightKnee.y + Math.cos(rightAngle + rightKneeBend) * legLength * 0.5 + downwardBias * 2
    } else {
      // Static: legs positioned for posture, with subtle micro-motion
      const staticSway = Math.sin(microPhase) * 0.3
      const staticBob = Math.sin(microPhase * 0.5) * 0.2

      if (posture === 'seated') {
        // Seated: knees bent up, ankles forward
        skeleton.leftKnee.x = skeleton.leftHip.x + staticSway
        skeleton.leftKnee.y = skeleton.leftHip.y + legLength * 0.3 + kneeBendStatic * 10
        skeleton.leftAnkle.x = skeleton.leftKnee.x + staticSway * 0.5
        skeleton.leftAnkle.y = skeleton.leftKnee.y + legLength * 0.4 + kneeBendStatic * 5 + staticBob

        skeleton.rightKnee.x = skeleton.rightHip.x + staticSway
        skeleton.rightKnee.y = skeleton.rightHip.y + legLength * 0.3 + kneeBendStatic * 10
        skeleton.rightAnkle.x = skeleton.rightKnee.x + staticSway * 0.5
        skeleton.rightAnkle.y = skeleton.rightKnee.y + legLength * 0.4 + kneeBendStatic * 5 + staticBob
      } else {
        // Upright or horizontal: legs straight down with slight bend
        skeleton.leftKnee.x = skeleton.leftHip.x + staticSway
        skeleton.leftKnee.y = skeleton.leftHip.y + legLength * 0.5
        skeleton.leftAnkle.x = skeleton.leftKnee.x + staticSway * 0.5
        skeleton.leftAnkle.y = skeleton.leftKnee.y + legLength * 0.5 + kneeBendStatic * 10 + staticBob

        skeleton.rightKnee.x = skeleton.rightHip.x + staticSway
        skeleton.rightKnee.y = skeleton.rightHip.y + legLength * 0.5
        skeleton.rightAnkle.x = skeleton.rightKnee.x + staticSway * 0.5
        skeleton.rightAnkle.y = skeleton.rightKnee.y + legLength * 0.5 + kneeBendStatic * 10 + staticBob
      }
    }

    return skeleton
  }

  const skeleton = computeSkeleton()

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="300" viewBox="0 0 200 300" className="border rounded">
        {/* Head */}
        <circle cx={skeleton.head.x} cy={skeleton.head.y} r="12" fill="none" stroke="black" strokeWidth="2" />

        {/* Torso */}
        <line x1={skeleton.neck.x} y1={skeleton.neck.y} x2={skeleton.hips.x} y2={skeleton.hips.y} stroke="black" strokeWidth="2" />

        {/* Arms */}
        <line x1={skeleton.leftShoulder.x} y1={skeleton.leftShoulder.y} x2={skeleton.leftElbow.x} y2={skeleton.leftElbow.y} stroke="black" strokeWidth="2" />
        <line x1={skeleton.leftElbow.x} y1={skeleton.leftElbow.y} x2={skeleton.leftWrist.x} y2={skeleton.leftWrist.y} stroke="black" strokeWidth="2" />
        <line x1={skeleton.rightShoulder.x} y1={skeleton.rightShoulder.y} x2={skeleton.rightElbow.x} y2={skeleton.rightElbow.y} stroke="black" strokeWidth="2" />
        <line x1={skeleton.rightElbow.x} y1={skeleton.rightElbow.y} x2={skeleton.rightWrist.x} y2={skeleton.rightWrist.y} stroke="black" strokeWidth="2" />

        {/* Legs */}
        <line x1={skeleton.leftHip.x} y1={skeleton.leftHip.y} x2={skeleton.leftKnee.x} y2={skeleton.leftKnee.y} stroke="black" strokeWidth="2" />
        <line x1={skeleton.leftKnee.x} y1={skeleton.leftKnee.y} x2={skeleton.leftAnkle.x} y2={skeleton.leftAnkle.y} stroke="black" strokeWidth="2" />
        <line x1={skeleton.rightHip.x} y1={skeleton.rightHip.y} x2={skeleton.rightKnee.x} y2={skeleton.rightKnee.y} stroke="black" strokeWidth="2" />
        <line x1={skeleton.rightKnee.x} y1={skeleton.rightKnee.y} x2={skeleton.rightAnkle.x} y2={skeleton.rightAnkle.y} stroke="black" strokeWidth="2" />

        {/* Feet */}
        <line x1={skeleton.leftAnkle.x} y1={skeleton.leftAnkle.y} x2={skeleton.leftAnkle.x - 8} y2={skeleton.leftAnkle.y + 5} stroke="black" strokeWidth="2" />
        <line x1={skeleton.rightAnkle.x} y1={skeleton.rightAnkle.y} x2={skeleton.rightAnkle.x + 8} y2={skeleton.rightAnkle.y + 5} stroke="black" strokeWidth="2" />
      </svg>
      <p className="text-sm text-gray-600 mt-2 text-center">
        Simplified interpretation of inferred motion pattern from IMU data
      </p>
      <div className={`mt-2 px-2 py-1 rounded text-xs font-semibold ${
        motionType === 'dynamic' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {motionType.toUpperCase()} MOTION
      </div>
    </div>
  )
}