@echo off
setlocal enabledelayedexpansion

REM Launches the PT Study Brain web dashboard and always uses the newest dashboard_web*.py file.

REM Base directory (folder containing pt_study_brain)
set "BASE=%~dp0"
set "APP_DIR=%BASE%pt_study_brain"
set "PYTHONIOENCODING=utf-8"

REM If this folder is a git repo, try to pull latest (safe to ignore failure)
if exist "%BASE%.git" (
  echo [0/4] Updating repo (git pull --ff-only)...
  pushd "%BASE%" >nul
  git pull --ff-only
  if errorlevel 1 echo [WARN] git pull skipped/failed; using local files.
  popd >nul
)

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Python is not in PATH. Install Python 3.8+ and try again.
  pause
  exit /b 1
)

echo [1/4] Ensuring dependencies are installed...
cd /d "%APP_DIR%"
if errorlevel 1 (
  echo [ERROR] Failed to change to PT Study Brain directory.
  pause
  exit /b 1
)

python -m pip install --upgrade pip >nul 2>&1
python -m pip install -r requirements.txt
if errorlevel 1 (
  echo [ERROR] pip install failed.
  pause
  exit /b 1
)

echo [2/4] Selecting newest dashboard script...
set "RUNFILE="
for /f "delims=" %%F in ('dir /b /a:-d /o:-d "%APP_DIR%\dashboard_web*.py"') do (
  set "RUNFILE=%%F"
  goto :found
)
:found
if not defined RUNFILE (
  echo [ERROR] No dashboard_web*.py found.
  pause
  exit /b 1
)
echo       Using !RUNFILE!

echo [3/4] Starting dashboard server...
start "PT Study Brain Dashboard" cmd /k "cd /d \"%APP_DIR%\" && python !RUNFILE!"

REM Small wait for the server to spin up
timeout /t 2 /nobreak >nul

echo [4/4] Opening browser at http://127.0.0.1:5000 ...
start http://127.0.0.1:5000

echo.
echo Done! Dashboard is running at http://127.0.0.1:5000
echo Close the server window to stop the dashboard.
echo.
pause
