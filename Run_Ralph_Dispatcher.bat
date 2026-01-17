@echo off
setlocal
set "SCRIPT=%~dp0tools\ralph-dispatcher\dispatcher.ps1"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT%"
