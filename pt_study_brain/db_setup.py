#!/usr/bin/env python3
"""
Database setup and schema initialization for PT Study Brain.
"""

import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), 'data', 'pt_study.db')

def init_database():
    """
    Initialize the SQLite database with the sessions table.
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create sessions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_date TEXT NOT NULL,
            session_time TEXT NOT NULL,
            topic TEXT NOT NULL,
            study_mode TEXT NOT NULL,
            time_spent_minutes INTEGER NOT NULL,
            frameworks_used TEXT,
            gated_platter_triggered TEXT,
            wrap_phase_reached TEXT,
            anki_cards_count INTEGER,
            understanding_level INTEGER,
            retention_confidence INTEGER,
            system_performance INTEGER,
            what_worked TEXT,
            what_needs_fixing TEXT,
            notes_insights TEXT,
            created_at TEXT NOT NULL,
            UNIQUE(session_date, session_time, topic)
        )
    ''')
    
    # Create indexes for common queries
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_session_date 
        ON sessions(session_date)
    ''')
    
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_topic 
        ON sessions(topic)
    ''')
    
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_study_mode 
        ON sessions(study_mode)
    ''')
    
    conn.commit()
    conn.close()
    
    # ASCII-only to avoid Windows console encoding issues
    print(f"[OK] Database initialized at: {DB_PATH}")

def get_connection():
    """
    Get a database connection.
    """
    return sqlite3.connect(DB_PATH)

if __name__ == '__main__':
    init_database()
