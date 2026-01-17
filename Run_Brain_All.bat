@echo off
setlocal EnableDelayedExpansion
rem One-click: sync logs -> regenerate resume -> start dashboard -> open browser (with health check).

cd /d "%~dp0"

rem Configure Study RAG drop-folder (used by Tutor -> Study sync)
set "PT_STUDY_RAG_DIR=C:\Users\treyt\OneDrive\Desktop\PT School"

rem Resolve Python (prefer python, fallback to py -3)
set "PYEXE="
set "PYEXE_ARGS="
for %%I in (python py) do (
    where %%I >nul 2>nul && set "PYEXE=%%I" && goto :PYFOUND
)
echo [ERROR] Python was not found on PATH. Install Python 3 or add it to PATH.
echo         If you use the Python Launcher, install it so `py -3` works.
goto END

:PYFOUND
if /I "%PYEXE%"=="py" set "PYEXE_ARGS=-3"

echo [1/5] Ensuring Brain database is initialized...
cd /d "%~dp0brain"
if not exist "db_setup.py" (
    echo [ERROR] Could not find brain\db_setup.py from %~dp0.
    goto END
)
"%PYEXE%" %PYEXE_ARGS% db_setup.py
if %errorlevel% NEQ 0 (
    echo [ERROR] Failed to initialize database. Check Python installation and brain\db_setup.py.
    goto END
)

cd /d "%~dp0"
echo [2/5] Syncing logs and regenerating resume...
if not exist "brain\sync_all.ps1" (
    echo [ERROR] Could not find brain\sync_all.ps1 from %~dp0.
    goto END
)
powershell -ExecutionPolicy Bypass -File brain\sync_all.ps1

if %errorlevel% NEQ 0 (
    echo [ERROR] Failed to sync logs or regenerate resume.
    goto END
)


echo [4/5] Starting dashboard server (window titled 'PT Study Brain Dashboard')...
set "SERVER_DIR=%~dp0brain"
if not exist "%SERVER_DIR%\dashboard_web.py" (
    echo [ERROR] Could not find brain\dashboard_web.py from %~dp0.
    goto END
)

rem Check if Frontend Build exists (expects /static/react/assets/*.js)
set "REACT_BUILD_DIR=%SERVER_DIR%\static\react"
if not exist "%REACT_BUILD_DIR%\assets\*.js" (
    echo [INFO] Frontend build missing. Installing and building Arcade Frontend...
    set "CLIENT_DIR=%~dp0dashboard_rebuild\client"
    cd /d "!CLIENT_DIR!"
    if not exist "node_modules\" call npm install
    call npm run build
    
    echo [INFO] Copying build files...
    robocopy "%~dp0dashboard_rebuild\dist" "%SERVER_DIR%\static\react" /E /NFL /NDL /NJH /NJS /nc /ns /np

    if %errorlevel% GEQ 8 (
        echo [ERROR] Failed to copy frontend build into brain\static\react.
        goto END
    )
)

rem Update react index.html to point at latest built asset
for /f "delims=" %%F in ('dir /b /o-d "%REACT_BUILD_DIR%\assets\index-*.js"') do (
    set "LATEST_REACT_JS=%%F"
    goto :FOUND_REACT_JS
)
:FOUND_REACT_JS
if defined LATEST_REACT_JS (
    echo [INFO] Pointing index.html to !LATEST_REACT_JS!...
    powershell -ExecutionPolicy Bypass -Command "(Get-Content -Raw '%REACT_BUILD_DIR%\index.html') -replace 'src=\"/src/main.tsx\"', 'src=\"/react/assets/!LATEST_REACT_JS!\"' | Set-Content '%REACT_BUILD_DIR%\index.html'"
)

start "PT Study Brain Dashboard" cmd /k "cd /d "%SERVER_DIR%" && "%PYEXE%" %PYEXE_ARGS% dashboard_web.py"


echo [5/5] Giving the server a few seconds to start...
timeout /t 5 /nobreak >nul

:OPEN_BROWSER
echo Opening dashboard in browser...
start "" http://127.0.0.1:5000

:END
echo Done. Leave the 'PT Study Brain Dashboard' window open while you use the site.
endlocal
