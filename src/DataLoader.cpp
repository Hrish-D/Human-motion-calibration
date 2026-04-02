#include "DataLoader.h"
#include <fstream>
#include <sstream>
#include <iostream>
#include <stdexcept>

std::vector<Signal> DataLoader::loadSignalFile(const std::string& filename) {
    std::vector<Signal> signals;
    std::ifstream file(filename);
    if (!file.is_open()) {
        throw std::runtime_error("Failed to open file: " + filename);
    }

    std::string line;
    while (std::getline(file, line)) {
        std::istringstream iss(line);
        Signal signal;
        double value;
        while (iss >> value) {
            signal.push_back(value);
        }
        if (signal.size() != 128) {
            std::cerr << "Warning: Expected 128 samples, got " << signal.size() << " in line\n";
        }
        signals.push_back(signal);
    }
    file.close();
    return signals;
}

Labels DataLoader::loadLabels(const std::string& filename) {
    Labels labels;
    std::ifstream file(filename);
    if (!file.is_open()) {
        throw std::runtime_error("Failed to open file: " + filename);
    }

    int label;
    while (file >> label) {
        labels.push_back(label);
    }
    file.close();
    return labels;
}

Dataset DataLoader::loadDataset(const std::vector<std::string>& signalFiles) {
    if (signalFiles.size() != 6) {
        throw std::invalid_argument("Expected 6 signal files");
    }

    // Load all signal files
    std::vector<std::vector<Signal>> allSignals;
    for (const auto& file : signalFiles) {
        allSignals.push_back(loadSignalFile(file));
    }

    // Transpose to get windows: each window has 6 signals
    size_t numWindows = allSignals[0].size();
    Dataset dataset(numWindows, WindowSignals(6));
    for (size_t w = 0; w < numWindows; ++w) {
        for (size_t s = 0; s < 6; ++s) {
            dataset[w][s] = allSignals[s][w];
        }
    }
    return dataset;
}