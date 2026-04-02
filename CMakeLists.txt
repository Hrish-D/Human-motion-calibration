cmake_minimum_required(VERSION 3.10)
project(har_rehab_cpp VERSION 1.0)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Include directories
include_directories(include)

# Source files
set(SOURCES
    src/main.cpp
    src/DataLoader.cpp
    src/SignalProcessing.cpp
    src/Metrics.cpp
)

# Create executable
add_executable(${PROJECT_NAME} ${SOURCES})

# Optional: Enable warnings
if(MSVC)
    target_compile_options(${PROJECT_NAME} PRIVATE /W4)
else()
    target_compile_options(${PROJECT_NAME} PRIVATE -Wall -Wextra -Wpedantic)
endif()