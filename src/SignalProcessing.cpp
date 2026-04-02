#include "SignalProcessing.h"
#include <cmath>
#include <numeric>
#include <algorithm>
#include <stdexcept>
#include <algorithm>
#include <stdexcept>

Signal SignalProcessing::computeMagnitude(const Signal& x, const Signal& y, const Signal& z) {
    if (x.size() != y.size() || y.size() != z.size()) {
        throw std::invalid_argument("Signal sizes must match");
    }
    Signal mag;
    mag.reserve(x.size());
    for (size_t i = 0; i < x.size(); ++i) {
        mag.push_back(std::sqrt(x[i] * x[i] + y[i] * y[i] + z[i] * z[i]));
    }
    return mag;
}

Signal SignalProcessing::movingAverage(const Signal& signal, int windowSize) {
    Signal smoothed;
    smoothed.reserve(signal.size());
    for (size_t i = 0; i < signal.size(); ++i) {
        double sum = 0.0;
        int count = 0;
        for (int j = -windowSize / 2; j <= windowSize / 2; ++j) {
            int idx = static_cast<int>(i) + j;
            if (idx >= 0 && idx < static_cast<int>(signal.size())) {
                sum += signal[idx];
                ++count;
            }
        }
        smoothed.push_back(sum / count);
    }
    return smoothed;
}

double SignalProcessing::computeMean(const Signal& signal) {
    if (signal.empty()) return 0.0;
    return std::accumulate(signal.begin(), signal.end(), 0.0) / signal.size();
}

double SignalProcessing::computeStdDev(const Signal& signal, double mean) {
    if (signal.size() <= 1) return 0.0;
    double sumSq = 0.0;
    for (double val : signal) {
        double diff = val - mean;
        sumSq += diff * diff;
    }
    return std::sqrt(sumSq / (signal.size() - 1));
}

double SignalProcessing::findMax(const Signal& signal) {
    if (signal.empty()) return 0.0;
    return *std::max_element(signal.begin(), signal.end());
}