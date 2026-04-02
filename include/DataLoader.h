#pragma once

#include "Types.h"
#include <vector>
#include <string>

class DataLoader {
public:
    // Load a signal file (e.g., body_acc_x_train.txt) into a vector of signals
    // Each signal is a vector of 128 doubles
    std::vector<Signal> loadSignalFile(const std::string& filename);

    // Load labels from y_train.txt
    Labels loadLabels(const std::string& filename);

    // Load all signal files and return dataset
    Dataset loadDataset(const std::vector<std::string>& signalFiles);
};