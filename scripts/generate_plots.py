#!/usr/bin/env python3
"""
Generate plots from HAR analysis CSV outputs.

This script reads summary_by_activity.csv and creates bar charts for key metrics.
"""

from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt


def main():
    script_dir = Path(__file__).parent
    project_root = script_dir.parent

    csv_path = project_root / 'summary_by_activity.csv'
    plots_dir = project_root / 'plots'
    plots_dir.mkdir(exist_ok=True)

    if not csv_path.exists():
        raise FileNotFoundError(f"Required CSV file not found: {csv_path}")

    try:
        df = pd.read_csv(csv_path)
    except Exception as e:
        raise ValueError(f"Error reading CSV file: {e}")

    required_columns = ['Activity', 'Avg_Peak_Acc', 'Avg_Peak_Gyro', 'Avg_Smoothness']
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        raise ValueError(f"CSV file is missing required columns: {missing_columns}")

    df['activity_display'] = df['Activity'].str.replace('_', ' ').str.title()

    plt.style.use('default')
    plt.rcParams['figure.figsize'] = (10, 6)
    plt.rcParams['font.size'] = 10

    fig, ax = plt.subplots()
    ax.bar(df['activity_display'], df['Avg_Peak_Acc'], edgecolor='black', alpha=0.7)
    ax.set_title('Average Peak Acceleration by Activity', fontsize=14, fontweight='bold')
    ax.set_xlabel('Activity', fontsize=12)
    ax.set_ylabel('Peak Acceleration', fontsize=12)
    ax.grid(axis='y', alpha=0.3)
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig(plots_dir / 'peak_acceleration.png', dpi=150, bbox_inches='tight')
    plt.close()

    fig, ax = plt.subplots()
    ax.bar(df['activity_display'], df['Avg_Peak_Gyro'], edgecolor='black', alpha=0.7)
    ax.set_title('Average Peak Gyroscope Magnitude by Activity', fontsize=14, fontweight='bold')
    ax.set_xlabel('Activity', fontsize=12)
    ax.set_ylabel('Peak Gyroscope Magnitude', fontsize=12)
    ax.grid(axis='y', alpha=0.3)
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig(plots_dir / 'peak_gyroscope.png', dpi=150, bbox_inches='tight')
    plt.close()

    fig, ax = plt.subplots()
    ax.bar(df['activity_display'], df['Avg_Smoothness'], edgecolor='black', alpha=0.7)
    ax.set_title('Average Smoothness by Activity', fontsize=14, fontweight='bold')
    ax.set_xlabel('Activity', fontsize=12)
    ax.set_ylabel('Smoothness Score', fontsize=12)
    ax.grid(axis='y', alpha=0.3)
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig(plots_dir / 'smoothness.png', dpi=150, bbox_inches='tight')
    plt.close()

    if 'Avg_Reps' in df.columns and df['Avg_Reps'].max() > 0:
        fig, ax = plt.subplots()
        ax.bar(df['activity_display'], df['Avg_Reps'], edgecolor='black', alpha=0.7)
        ax.set_title('Average Repetition Count by Activity', fontsize=14, fontweight='bold')
        ax.set_xlabel('Activity', fontsize=12)
        ax.set_ylabel('Repetition Count', fontsize=12)
        ax.grid(axis='y', alpha=0.3)
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()
        plt.savefig(plots_dir / 'repetitions.png', dpi=150, bbox_inches='tight')
        plt.close()
        print("Generated 4 plots including repetitions.")
    else:
        print("Generated 3 plots (repetitions not meaningful or not present).")

    print(f"Plots saved to {plots_dir}/")


if __name__ == "__main__":
    main()