@echo off
set ROOT=%~dp0

echo === START PROJECT ===
echo.
echo 1) ExecPlan:
echo    %ROOT%JANUARY_26_PLAN\EXECPLAN_DASHBOARD.md
echo 2) Status:
echo    %ROOT%.agent\context\STATUS.md
echo 3) Daily log:
echo    %ROOT%.agent\context\logs\daily_log.md
echo 4) Continuity:
echo    %ROOT%CONTINUITY.md

echo.
echo --- START_PROJECT.md ---
type "%ROOT%.agent\context\START_PROJECT.md"

echo.
echo Next: open the ExecPlan and follow the Progress section.
