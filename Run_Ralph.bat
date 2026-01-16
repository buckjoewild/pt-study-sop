@echo off
setlocal EnableDelayedExpansion

set "REPO=C:\Users\treyt\OneDrive\Desktop\pt-study-sop"
set "BUN_BIN=%USERPROFILE%\.bun\bin"
set "PRD=%REPO%\prd.json"

if not exist "%PRD%" (
  if exist "%REPO%\scripts\ralph\prd.json" (
    set "PRD=%REPO%\scripts\ralph\prd.json"
  ) else (
    echo prd.json not found at: %REPO%\prd.json
    echo Run: ralph-tui create-prd --chat
    pause
    exit /b 1
  )
)

REM Set PATH and run ralph-tui in a new window
set "PATH=%BUN_BIN%;%PATH%"
start "Ralph TUI" /d "%REPO%" cmd /k "set PATH=%BUN_BIN%;%%PATH%% & ralph-tui run --prd ""%PRD%"" --agent opencode --model openai/gpt-5.2-codex"

endlocal
