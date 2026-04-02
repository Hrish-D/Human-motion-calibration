# HAR Motion Analysis Pipeline

A C++17 signal processing pipeline for analyzing wearable inertial sensor data from the UCI Human Activity Recognition dataset. This project demonstrates how raw accelerometer and gyroscope data can be transformed into clinically relevant motion metrics through efficient data processing and automated validation.

## Project Takeaway

This project demonstrates:

- **Real-time sensor data processing** in C++ using efficient algorithms for IMU signal analysis  
- **Clinical metric extraction** including repetition counting, movement intensity, and smoothness scoring  
- **End-to-end data pipeline design** from raw sensor streams to structured CSV outputs  
- **Automated validation** through Python-based graphical analysis  
- **Modular and maintainable code structure** with clear separation of processing, metrics, and data handling  

The pipeline simulates a rehabilitation monitoring system capable of tracking patient motion quality and activity patterns.

## Analysis Pipeline

Raw Sensor Data
      ↓
Signal Processing (C++)
      ↓
Feature Extraction
      ↓
CSV Outputs
      ↓
Python Visualization

## Key Observations

- Dynamic activities (e.g., walking) show higher peak acceleration and repetition counts  
- Static activities (e.g., sitting, standing) exhibit lower variance and higher smoothness  
- Gyroscope magnitude helps distinguish rotational motion between activity types  


## Project Structure

```text
har_rehab_cpp/
│
├── data/                     # Raw HAR dataset
├── src/                      # C++ source files
│   ├── main.cpp
│   ├── DataLoader.cpp
│   ├── SignalProcessing.cpp
│   └── Metrics.cpp
├── include/                  # Header files
├── scripts/                  # Python visualization
│   └── generate_plots.py
├── plots/                    # Generated graphs
├── web/                      # Optional frontend
├── summary_by_activity.csv
├── window_metrics.csv
├── CMakeLists.txt
└── README.md
```

## Prerequisites

- **C++ Build Tools:** CMake 3.10+, C++17 compiler (GCC, Clang, or MSVC)  
- **Python 3.7+** with:
pip install pandas matplotlib


## How to Run

### 1. Build the C++ Pipeline

Using CMake:

mkdir build
cd build
cmake ..
cmake --build .


### 2. Run the Analysis
./build/Debug/har_rehab_cpp.exe


Outputs:

- `summary_by_activity.csv`  
- `window_metrics.csv`  


### 3. Generate Plots
python scripts/generate_plots.py


Generates:

- Peak acceleration plot  
- Gyroscope magnitude plot  
- Smoothness plot  
- Repetition count plot  

## Applications

- Rehabilitation monitoring  
- Movement quality assessment  
- Injury recovery tracking  
- Wearable sensor analytics  
- Biomechanics research  
