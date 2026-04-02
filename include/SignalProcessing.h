#pragma once

#include "Types.h"
#include <vector>

class SignalProcessing {
public:
    // Compute magnitude from three signals: sqrt(x^2 + y^2 + z^2)
    Signal computeMagnitude(const Signal& x, const Signal& y, const Signal& z);

    // Apply moving average smoothing with given window size
    Signal movingAverage(const Signal& signal, int windowSize = 5);

    // Compute mean of a signal
    double computeMean(const Signal& signal);

    // Compute standard deviation of a signal
    double computeStdDev(const Signal& signal, double mean);

    // Find maximum value in a signal
    double findMax(const Signal& signal);
};