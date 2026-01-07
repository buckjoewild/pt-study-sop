@echo off
setlocal enabledelayedexpansion

REM Repo root = parent of scripts folder
set "SCRIPT_DIR=%~dp0"
for %%I in ("%SCRIPT_DIR%..") do set "REPO_ROOT=%%~fI"
cd /d "%REPO_ROOT%"

echo.
echo === The Scholar Launcher ===
echo Repo: %REPO_ROOT%
echo.

where git >nul 2>&1
if errorlevel 1 (
  echo ERROR: git not found in PATH.
  pause
  exit /b 1
)

REM Ensure correct branch
git rev-parse --verify scholar-orchestrator-loop >nul 2>&1
if errorlevel 1 (
  echo ERROR: Branch scholar-orchestrator-loop not found. Create it first.
  pause
  exit /b 1
)

git checkout scholar-orchestrator-loop >nul 2>&1
if errorlevel 1 (
  echo ERROR: Failed to checkout scholar-orchestrator-loop.
  pause
  exit /b 1
)

:menu
echo.
echo Choose:
echo   1) Run Scholar (no web search)
echo   2) Run Scholar (with web search)
echo   3) Open scholar\outputs
echo   4) Exit
set /p choice=Enter choice (1-4): 

if "%choice%"=="1" goto run_noweb
if "%choice%"=="2" goto run_web
if "%choice%"=="3" goto open_outputs
if "%choice%"=="4" goto end

echo Invalid choice.
goto menu

:open_outputs
start "" "%REPO_ROOT%\scholar\outputs"
goto menu

:run_noweb
echo.
echo Running Codex CLI (no web search)...
echo.
codex -m "%REPO_ROOT%\scholar\workflows\orchestrator_run_prompt.md"
if errorlevel 1 (
  echo Codex returned an error.
)
pause
goto menu

:run_web
echo.
echo Running Codex CLI (with web search)...
echo NOTE: If Codex CLI does not support --search on this install, it will run without it.
echo.
codex --search -m "%REPO_ROOT%\scholar\workflows\orchestrator_run_prompt.md"
if errorlevel 1 (
  echo Codex returned an error.
)
pause
goto menu

:end
endlocal
exit /b 0
