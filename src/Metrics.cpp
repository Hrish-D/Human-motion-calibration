#include "Metrics.h"
#include <map>
#include <cmath>
#include <stdexcept>
#include <algorithm>
#include <stdexcept>

WindowMetrics Metrics::computeWindowMetrics(const WindowSignals& window) {
    if (window.size() != 6) {
        throw std::invalid_argument("Window must have 6 signals");
    }

    SignalProcessing sp;

    // Compute magnitudes
    Signal accMag = sp.computeMagnitude(window[0], window[1], window[2]); // acc x,y,z
    Signal gyroMag = sp.computeMagnitude(window[3], window[4], window[5]); // gyro x,y,z

    // Smooth acceleration for rep detection
    Signal smoothedAcc = sp.movingAverage(accMag);

    WindowMetrics metrics;
    metrics.maxAcc = sp.findMax(accMag);
    metrics.meanAcc = sp.computeMean(accMag);
    metrics.stdAcc = sp.computeStdDev(accMag, metrics.meanAcc);

    metrics.maxGyro = sp.findMax(gyroMag);
    metrics.meanGyro = sp.computeMean(gyroMag);
    metrics.stdGyro = sp.computeStdDev(gyroMag, metrics.meanGyro);

    metrics.repCount = detectRepetitions(smoothedAcc);
    metrics.smoothness = computeSmoothness(accMag);

    return metrics;
}

int Metrics::detectRepetitions(const Signal& smoothedAccMag) {
    if (smoothedAccMag.size() < 3) return 0;

    SignalProcessing sp;
    double mean = sp.computeMean(smoothedAccMag);
    double stddev = sp.computeStdDev(smoothedAccMag, mean);

    // If signal is too flat (low variance), no repetitions
    if (stddev < 0.01) return 0;

    double threshold = mean + 1.0 * stddev; // Adaptive threshold

    int minDistance = 10; // Minimum samples between peaks
    int count = 0;
    int lastPeakIndex = -minDistance;

    for (size_t i = 1; i < smoothedAccMag.size() - 1; ++i) {
        double prev = smoothedAccMag[i - 1];
        double curr = smoothedAccMag[i];
        double next = smoothedAccMag[i + 1];

        if (curr > prev && curr > next && curr > threshold && (int)i - lastPeakIndex >= minDistance) {
            ++count;
            lastPeakIndex = i;
        }
    }
    return count;
}

double Metrics::computeSmoothness(const Signal& signal) {
    if (signal.size() < 2) return 0.0;
    Signal diffs;
    for (size_t i = 1; i < signal.size(); ++i) {
        diffs.push_back(std::abs(signal[i] - signal[i-1]));
    }
    SignalProcessing sp;
    double meanDiff = sp.computeMean(diffs);
    return sp.computeStdDev(diffs, meanDiff); // Lower std dev means smoother
}

std::vector<ActivitySummary> Metrics::aggregateByActivity(const std::vector<WindowMetrics>& metrics, const Labels& labels) {
    std::map<int, std::vector<WindowMetrics>> grouped;
    for (size_t i = 0; i < metrics.size(); ++i) {
        grouped[labels[i]].push_back(metrics[i]);
    }

    std::vector<ActivitySummary> summaries;
    std::map<int, std::string> labelNames = {
        {1, "WALKING"},
        {2, "WALKING_UPSTAIRS"},
        {3, "WALKING_DOWNSTAIRS"},
        {4, "SITTING"},
        {5, "STANDING"},
        {6, "LAYING"}
    };

    for (const auto& pair : grouped) {
        int label = pair.first;
        const auto& mets = pair.second;
        ActivitySummary sum;
        sum.activityLabel = label;
        sum.activityName = labelNames[label];
        sum.totalWindows = mets.size();

        double totalReps = 0, totalPeakAcc = 0, totalPeakGyro = 0, totalSmooth = 0;
        for (const auto& m : mets) {
            totalReps += m.repCount;
            totalPeakAcc += m.maxAcc;
            totalPeakGyro += m.maxGyro;
            totalSmooth += m.smoothness;
        }
        sum.avgReps = totalReps / sum.totalWindows;
        sum.avgPeakAcc = totalPeakAcc / sum.totalWindows;
        sum.avgPeakGyro = totalPeakGyro / sum.totalWindows;
        sum.avgSmoothness = totalSmooth / sum.totalWindows;

        summaries.push_back(sum);
    }
    return summaries;
}