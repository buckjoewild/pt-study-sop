Goal (incl. success criteria):
- Fix `Run_Brain_All.bat` so the PT Study Brain dashboard starts and stays open without the `main.tsx` MIME type error.
Constraints/Assumptions:
- Follow repo AGENTS.md; keep edits minimal and additive; avoid secrets.
- Ask before destructive actions.
Key decisions:
- Update `Run_Brain_All.bat` to rewrite `brain/static/react/index.html` to latest built JS asset.
State:
  - Done:
    - Updated `Run_Brain_All.bat` to rewrite `brain/static/react/index.html` with latest `index-*.js`.
  - Now:
    - Diagnose why the dashboard window closes immediately.
  - Next:
    - Capture error output from the batch run and adjust script or dependencies.
Open questions (UNCONFIRMED if needed):
- What error message appears when the window closes? (screenshot or text)
Working set (files/ids/commands):
- `C:/Users/treyt/OneDrive/Desktop/pt-study-sop/Run_Brain_All.bat`
- `C:/Users/treyt/OneDrive/Desktop/pt-study-sop/brain/static/react/index.html`
- `C:/Users/treyt/OneDrive/Desktop/pt-study-sop/brain/dashboard/app.py`
