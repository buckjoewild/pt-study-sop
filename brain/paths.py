#!/usr/bin/env python3
"""
Centralized Path Module - Single Source of Truth
All project paths defined in one place for consistency and maintainability.

Usage:
    from paths import PROJECT_ROOT, DATA_DIR, BRAIN_DIR, etc.
    
    # All paths are pathlib.Path objects
    db_file = DATA_DIR / "pt_study.db"
    config_file = DATA_DIR / "api_config.json"
"""

from pathlib import Path
import sys

# ============================================================================
# PROJECT ROOT & MAIN DIRECTORIES
# ============================================================================

# This file is at: brain/paths.py
# So parent.parent = project root (c:\brucebruce\trey\)
PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Main directories
BRAIN_DIR = PROJECT_ROOT / "brain"
DASHBOARD_REBUILD_DIR = PROJECT_ROOT / "dashboard_rebuild"
SCRIPTS_DIR = PROJECT_ROOT / "scripts"
DOCS_DIR = PROJECT_ROOT / "docs"
SCHOLAR_DIR = PROJECT_ROOT / "scholar"
SCHOLAR_OUTPUTS_DIR = SCHOLAR_DIR / "outputs"
ORCHESTRATOR_RUNS_DIR = SCHOLAR_OUTPUTS_DIR / "orchestrator_runs"

# ============================================================================
# BRAIN DATA DIRECTORIES
# ============================================================================

DATA_DIR = BRAIN_DIR / "data"
SESSION_LOGS_DIR = BRAIN_DIR / "session_logs"
OUTPUT_DIR = BRAIN_DIR / "output"

# Data subdirectories (within data/)
STUDY_RAG_DIR = DATA_DIR / "study_rag"
PROJECT_FILES_DIR = DATA_DIR / "project_files"
UPLOADS_DIR = DATA_DIR / "uploads"

# Database paths
DB_PATH = DATA_DIR / "pt_study.db"
API_CONFIG_PATH = DATA_DIR / "api_config.json"
GCAL_TOKEN_PATH = DATA_DIR / "gcal_token.json"

# ============================================================================
# FLASK STATIC & TEMPLATES
# ============================================================================

STATIC_DIR = BRAIN_DIR / "static"
DIST_DIR = STATIC_DIR / "dist"
TEMPLATES_DIR = BRAIN_DIR / "templates"

CSS_DIR = STATIC_DIR / "css"
IMAGES_DIR = STATIC_DIR / "images"

# ============================================================================
# FRONTEND (DASHBOARD REBUILD)
# ============================================================================

DASHBOARD_CLIENT_DIR = DASHBOARD_REBUILD_DIR / "client"
DASHBOARD_CLIENT_SRC = DASHBOARD_CLIENT_DIR / "src"
DASHBOARD_SHARED_DIR = DASHBOARD_REBUILD_DIR / "shared"
DASHBOARD_ASSETS_DIR = DASHBOARD_REBUILD_DIR / "attached_assets"

# ============================================================================
# INITIALIZATION
# ============================================================================

def initialize_directories():
    """Create all necessary directories if they don't exist."""
    directories = [
        DATA_DIR,
        SESSION_LOGS_DIR,
        OUTPUT_DIR,
        STUDY_RAG_DIR,
        PROJECT_FILES_DIR,
        STATIC_DIR,
        DIST_DIR,
        CSS_DIR,
        IMAGES_DIR,
    ]
    
    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)


def validate_paths():
    """Validate that essential paths exist and are correct."""
    errors = []
    
    # Check project structure
    if not BRAIN_DIR.exists():
        errors.append(f"BRAIN_DIR not found: {BRAIN_DIR}")
    
    if not DASHBOARD_REBUILD_DIR.exists():
        errors.append(f"DASHBOARD_REBUILD_DIR not found: {DASHBOARD_REBUILD_DIR}")
    
    # Check frontend source
    if not DASHBOARD_CLIENT_SRC.exists():
        errors.append(f"DASHBOARD_CLIENT_SRC not found: {DASHBOARD_CLIENT_SRC}")
    
    return errors


def get_path_info():
    """Get a summary of all paths for debugging."""
    return {
        "PROJECT_ROOT": str(PROJECT_ROOT),
        "BRAIN_DIR": str(BRAIN_DIR),
        "DATA_DIR": str(DATA_DIR),
        "STATIC_DIR": str(STATIC_DIR),
        "DIST_DIR": str(DIST_DIR),
        "TEMPLATES_DIR": str(TEMPLATES_DIR),
        "DASHBOARD_REBUILD_DIR": str(DASHBOARD_REBUILD_DIR),
        "DASHBOARD_CLIENT_DIR": str(DASHBOARD_CLIENT_DIR),
    }


# ============================================================================
# AUTO-INITIALIZE ON IMPORT
# ============================================================================

# Create directories automatically when this module is imported
initialize_directories()

# Validate paths and warn if there are issues
_validation_errors = validate_paths()
if _validation_errors:
    import warnings
    for error in _validation_errors:
        warnings.warn(f"Path validation error: {error}", RuntimeWarning)

# Ensure sys.path includes the brain directory for imports
_brain_dir_str = str(BRAIN_DIR)
if _brain_dir_str not in sys.path:
    sys.path.insert(0, _brain_dir_str)

_project_root_str = str(PROJECT_ROOT)
if _project_root_str not in sys.path:
    sys.path.insert(0, _project_root_str)


# ============================================================================
# CONVENIENCE EXPORTS
# ============================================================================

__all__ = [
    # Project roots
    "PROJECT_ROOT",
    "BRAIN_DIR",
    "DASHBOARD_REBUILD_DIR",
    "SCRIPTS_DIR",
    "DOCS_DIR",
    "SCHOLAR_DIR",
    "SCHOLAR_OUTPUTS_DIR",
    "ORCHESTRATOR_RUNS_DIR",
    
    # Brain data
    "DATA_DIR",
    "SESSION_LOGS_DIR",
    "OUTPUT_DIR",
    "STUDY_RAG_DIR",
    "PROJECT_FILES_DIR",
    "UPLOADS_DIR",
    
    # Database
    "DB_PATH",
    "API_CONFIG_PATH",
    "GCAL_TOKEN_PATH",
    
    # Flask static/templates
    "STATIC_DIR",
    "DIST_DIR",
    "TEMPLATES_DIR",
    "CSS_DIR",
    "IMAGES_DIR",
    
    # Frontend
    "DASHBOARD_CLIENT_DIR",
    "DASHBOARD_CLIENT_SRC",
    "DASHBOARD_SHARED_DIR",
    "DASHBOARD_ASSETS_DIR",
    
    # Functions
    "initialize_directories",
    "validate_paths",
    "get_path_info",
]
