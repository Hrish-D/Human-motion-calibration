#pragma once

#include <vector>
#include <string>

// Type aliases for clarity
using Signal = std::vector<double>;  // A single signal channel (128 samples)
using WindowSignals = std::vector<Signal>;  // All signals for one window (6 signals: 3 acc + 3 gyro)
using Dataset = std::vector<WindowSignals>;  // All windows
using Labels = std::vector<int>;  // Activity labels for each window

// Structure to hold metrics for a single window
struct WindowMetrics {
    double maxAcc = 0.0;
    double meanAcc = 0.0;
    double stdAcc = 0.0;
    double maxGyro = 0.0;
    double meanGyro = 0.0;
    double stdGyro = 0.0;
    int repCount = 0;
    double smoothness = 0.0;
};

// Structure for aggregated metrics per activity
struct ActivitySummary {
    int activityLabel = 0;
    std::string activityName;
    double avgReps = 0.0;
    double avgPeakAcc = 0.0;
    double avgPeakGyro = 0.0;
    double avgSmoothness = 0.0;
    int totalWindows = 0;
};