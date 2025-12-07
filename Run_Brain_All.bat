@echo off
setlocal EnableDelayedExpansion
rem One-click: sync logs -> regenerate resume -> start dashboard -> open browser (with health check).

cd /d "%~dp0"

echo [1/4] Syncing logs and regenerating resume...
powershell -ExecutionPolicy Bypass -File brain\sync_all.ps1

echo [2/4] Starting dashboard server (window titled 'PT Study Brain Dashboard')...
set SERVER_DIR=%~dp0brain
start "PT Study Brain Dashboard" cmd /k "cd /d \"%SERVER_DIR%\" && python dashboard_web.py"

echo [3/4] Waiting for server to come up on http://127.0.0.1:5000 ...
powershell -Command "for($i=1;$i -le 10;$i++){ if(Test-NetConnection -ComputerName 127.0.0.1 -Port 5000 -InformationLevel Quiet){ exit 0 }; Start-Sleep -Seconds 2 }; exit 1"
if %errorlevel% EQU 0 (
    echo Server is up.
    goto OPEN_BROWSER
)
echo [WARN] Server did not respond after 10 attempts. Check the 'PT Study Brain Dashboard' window for errors or port conflicts.
goto END

:OPEN_BROWSER
echo [4/4] Opening dashboard in browser...
start "" http://127.0.0.1:5000

:END
echo Done. Leave the 'PT Study Brain Dashboard' window open while you use the site.
endlocal
