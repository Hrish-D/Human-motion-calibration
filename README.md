Human Motion Calibration & Rehabilitation Analysis (HAR Pipeline)

A full-stack motion analysis pipeline that processes raw human activity sensor data, extracts meaningful biomechanical metrics, and visualizes results for rehabilitation insights.

This project combines:

High-performance C++ signal processing
Python-based data visualization
Optional Next.js frontend for interactive demos
🚀 Overview

This system analyzes human motion using accelerometer and gyroscope data from the UCI HAR dataset.

Pipeline:

Raw sensor data → processed in C++
Metrics extracted per activity
Results exported as CSV
Python generates plots
(Optional) Web app visualizes motion patterns
📂 Project Structure
har_rehab_cpp/
│
├── data/                     # Raw HAR dataset
│
├── src/                      # C++ source files
│   ├── main.cpp
│   ├── DataLoader.cpp
│   ├── SignalProcessing.cpp
│   └── Metrics.cpp
│
├── include/                  # Header files
│
├── scripts/
│   └── generate_plots.py     # Python visualization script
│
├── plots/                    # Generated graphs
│
├── web/                      # Next.js visualization app (optional)
│
├── summary_by_activity.csv   # Aggregated results
├── window_metrics.csv        # Window-level metrics
│
├── CMakeLists.txt
└── README.md
⚙️ Features
Signal processing (filtering, smoothing)
Peak acceleration detection
Gyroscope magnitude analysis
Movement smoothness calculation
Repetition estimation
Activity-based aggregation
🧠 Metrics Explained
Metric	Meaning
Peak Acceleration	Movement intensity
Gyroscope Magnitude	Rotational motion
Smoothness	Stability of motion
Repetitions	Estimated movement cycles
🛠️ Setup Instructions
1. Clone the Repository
git clone https://github.com/Hrish-D/Human-motion-calibration.git
cd Human-motion-calibration
2. Build the C++ Pipeline
Option A: Using g++
g++ -std=c++17 -Iinclude src/main.cpp src/DataLoader.cpp src/SignalProcessing.cpp src/Metrics.cpp -o har_rehab_cpp
Option B: Using CMake
mkdir build
cd build
cmake ..
cmake --build .
3. Run the Program
./har_rehab_cpp

This generates:

summary_by_activity.csv
window_metrics.csv
4. Generate Visualizations
python scripts/generate_plots.py

Output:

plots/peak_acceleration.png
plots/peak_gyroscope.png
plots/smoothness.png
plots/repetitions.png

✔ You already confirmed this works

🌐 Optional: Run Web Visualization
cd web
npm install
npm run dev

Open:

http://localhost:3000
