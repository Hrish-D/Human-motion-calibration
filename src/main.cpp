#include "DataLoader.h"
#include "SignalProcessing.h"
#include "Metrics.h"
#include <iostream>
#include <fstream>
#include <iomanip>
#include <map>

int main() {
    try {
        DataLoader loader;
        Metrics metricsCalc;

        // File paths
        std::vector<std::string> signalFiles = {
            "data/body_acc_x_train.txt",
            "data/body_acc_y_train.txt",
            "data/body_acc_z_train.txt",
            "data/body_gyro_x_train.txt",
            "data/body_gyro_y_train.txt",
            "data/body_gyro_z_train.txt"
        };

        std::string labelsFile = "data/y_train.txt";

        // Load data
        std::cout << "Loading dataset...\n";
        Dataset dataset = loader.loadDataset(signalFiles);
        Labels labels = loader.loadLabels(labelsFile);

        if (dataset.size() != labels.size()) {
            throw std::runtime_error("Dataset and labels size mismatch");
        }

        std::cout << "Loaded " << dataset.size() << " windows\n";

        // Compute metrics for each window
        std::vector<WindowMetrics> windowMetrics;
        for (const auto& window : dataset) {
            windowMetrics.push_back(metricsCalc.computeWindowMetrics(window));
        }

        // Aggregate by activity
        auto summaries = metricsCalc.aggregateByActivity(windowMetrics, labels);

        // Output to console
        std::cout << "\n=== ACTIVITY SUMMARIES ===\n";
        std::cout << std::fixed << std::setprecision(2);
        for (const auto& sum : summaries) {
            std::cout << "Activity: " << sum.activityName << " (" << sum.activityLabel << ")\n";
            std::cout << "  Total Windows: " << sum.totalWindows << "\n";
            std::cout << "  Avg Reps: " << sum.avgReps << "\n";
            std::cout << "  Avg Peak Acc: " << sum.avgPeakAcc << "\n";
            std::cout << "  Avg Peak Gyro: " << sum.avgPeakGyro << "\n";
            std::cout << "  Avg Smoothness: " << sum.avgSmoothness << "\n\n";
        }

        // Validation message
        std::map<int, ActivitySummary> summaryMap;
        for (const auto& sum : summaries) {
            summaryMap[sum.activityLabel] = sum;
        }
        if (summaryMap.count(1) && summaryMap.count(4)) {
            std::cout << "Validation: WALKING avg reps (" << summaryMap[1].avgReps << ") vs SITTING (" << summaryMap[4].avgReps << ")\n";
        }
        if (summaryMap.count(2) && summaryMap.count(5)) {
            std::cout << "Validation: WALKING_UPSTAIRS avg reps (" << summaryMap[2].avgReps << ") vs STANDING (" << summaryMap[5].avgReps << ")\n";
        }

        // Write to CSV files
        std::ofstream summaryFile("summary_by_activity.csv");
        summaryFile << "Activity,Label,Total_Windows,Avg_Reps,Avg_Peak_Acc,Avg_Peak_Gyro,Avg_Smoothness\n";
        for (const auto& sum : summaries) {
            summaryFile << sum.activityName << "," << sum.activityLabel << "," << sum.totalWindows << ","
                        << sum.avgReps << "," << sum.avgPeakAcc << "," << sum.avgPeakGyro << "," << sum.avgSmoothness << "\n";
        }
        summaryFile.close();

        std::ofstream windowFile("window_metrics.csv");
        windowFile << "Window,Label,Max_Acc,Mean_Acc,Std_Acc,Max_Gyro,Mean_Gyro,Std_Gyro,Rep_Count,Smoothness\n";
        for (size_t i = 0; i < windowMetrics.size(); ++i) {
            const auto& m = windowMetrics[i];
            windowFile << i << "," << labels[i] << "," << m.maxAcc << "," << m.meanAcc << "," << m.stdAcc << ","
                       << m.maxGyro << "," << m.meanGyro << "," << m.stdGyro << "," << m.repCount << "," << m.smoothness << "\n";
        }
        windowFile.close();

        std::cout << "Results written to summary_by_activity.csv and window_metrics.csv\n";

    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << "\n";
        return 1;
    }

    return 0;
}