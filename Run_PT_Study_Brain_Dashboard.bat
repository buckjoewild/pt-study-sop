@echo off
setlocal

REM Launches the PT Study Brain web dashboard, handling deps automatically.

REM Base directory (folder containing pt_study_brain)
set "BASE=%~dp0"
set "APP_DIR=%BASE%pt_study_brain"
set "PYTHONIOENCODING=utf-8"

REM Use system Python
python --version >nul 2>&1 || (
  echo [ERROR] Python is not in PATH. Install Python 3.8+ and try again.
  goto :EOF
)

echo [1/3] Ensuring dependencies are installed...
pushd "%APP_DIR%"
python -m pip install --upgrade pip >nul 2>&1
python -m pip install -r requirements.txt
if errorlevel 1 (
  echo [ERROR] pip install failed.
  popd
  goto :EOF
)

echo [2/3] Starting dashboard server (new UI)...
REM Start the server in a new window and keep this one for status.
start "PT Study Brain Dashboard (New UI)" cmd /k "cd /d \"%APP_DIR%\" && python dashboard_web_new.py"

echo [3/3] Opening browser at http://127.0.0.1:5000 ...
start http://127.0.0.1:5000

echo Done. A new window is running the server; close it to stop the dashboard.
popd
endlocal
