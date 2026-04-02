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

### Key Observations

- Dynamic activities (e.g., walking) show higher peak acceleration and repetition counts  
- Static activities (e.g., sitting, standing) exhibit lower variance and higher smoothness  
- Gyroscope magnitude helps distinguish rotational motion between activity types  

## Prerequisites

- **C++ Build Tools**: CMake 3.10+, C++17 compiler (GCC, Clang, or MSVC)  
- **Python 3.7+** with:
  ```bash
  pip install pandas matplotlib