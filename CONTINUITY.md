Goal (incl. success criteria):
- Add trend visualization to Brain dashboard Overview tab.
- Success criteria:
  1. Add `get_trend_data(days=30)` function in dashboard/stats.py. ✓
  2. Add `GET /api/trends?days=30` endpoint in dashboard/routes.py. ✓
  3. Add "Study Trends" section with canvas and period dropdown in dashboard.html. ✓
  4. Add JS to fetch and render line chart with understanding/retention in dashboard.js. ✓
  5. Add CSS styles for trends section in dashboard.css. ✓

Constraints/Assumptions:
- Use simple canvas line chart (no external libs).
- Reuse existing chart patterns from modeChart.
- Handle empty data gracefully.
- Make chart responsive.

Key decisions:
- Query sessions table, group by date, calculate daily averages.
- Purple line for understanding, blue line for retention.
- Support 7/14/30 day periods via dropdown.

State:
  - Done: Trend visualization feature complete.
  - Now: Ready for testing.
  - Next: User validation.

Open questions (UNCONFIRMED if needed):
- None.

Working set (files/ids/commands):
- brain/dashboard/stats.py
- brain/dashboard/routes.py
- brain/templates/dashboard.html
- brain/static/js/dashboard.js
- brain/static/css/dashboard.css

Notes:
- Study RAG directory can be overridden via env var PT_STUDY_RAG_DIR (currently set in Run_Brain_All.bat to C:\Users\treyt\OneDrive\Desktop\PT School)
