#!/usr/bin/env python3
"""
Entry point for the Dashboard v2.0.
Refactored to use brain.dashboard package.
"""

import sys
from pathlib import Path

# Add project root to path so we can import 'scholar' package
from paths import PROJECT_ROOT, BRAIN_DIR

sys.path.insert(0, str(BRAIN_DIR))
sys.path.insert(0, str(PROJECT_ROOT))

from dashboard import create_app

if __name__ == "__main__":
    app = create_app()
    # Disable reloader to avoid connection resets during API calls
    app.run(debug=False, use_reloader=False, host="127.0.0.1", port=5000)
