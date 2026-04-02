#pragma once

#include "Types.h"
#include "SignalProcessing.h"
#include <vector>

class Metrics {
public:
    // Compute all metrics for a single window
    WindowMetrics computeWindowMetrics(const WindowSignals& window);

    // Detect repetitions using peak detection on smoothed acceleration magnitude
    int detectRepetitions(const Signal& smoothedAccMag);

    // Compute smoothness score (lower is smoother, based on variance of differences)
    double computeSmoothness(const Signal& signal);

    // Aggregate metrics by activity
    std::vector<ActivitySummary> aggregateByActivity(const std::vector<WindowMetrics>& metrics, const Labels& labels);
};