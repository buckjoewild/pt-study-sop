#!/usr/bin/env python3
"""
Configuration settings for PT Study Brain.
"""

import os

# Base paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
SESSION_LOGS_DIR = os.path.join(BASE_DIR, 'session_logs')

# Database
DB_PATH = os.path.join(DATA_DIR, 'pt_study.db')

# Study modes
STUDY_MODES = ['Sprint', 'Core', 'Drill']

# Score ranges
SCORE_MIN = 1
SCORE_MAX = 5

# Thresholds for analytics
WEAK_THRESHOLD = 3  # Scores <= 3 are considered weak areas
STRONG_THRESHOLD = 4  # Scores >= 4 are considered strong

# Display settings
RECENT_SESSIONS_COUNT = 10  # Number of recent sessions to include in resume
