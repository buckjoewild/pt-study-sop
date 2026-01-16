Goal (incl. success criteria):
- Provide a Windows .bat that opens a new terminal and runs Ralph TUI with OpenCode for pt-study-sop.
- Success = `Run_Ralph.bat` works with scripts/ralph/prd.json fallback and correct quoting.
Constraints/Assumptions:
- Follow `C:\Users\treyt\OneDrive\Desktop\pt-study-sop\AGENTS.md` (continuity ledger required each turn).
- Do not store/paste API keys or secrets in repo files.
Key decisions:
- Use doubled-percent for PATH in start cmd and doubled-quotes for PRD path with spaces.
State:
  - Done:
    - Updated `Run_Ralph.bat` with EnableDelayedExpansion and proper quote escaping for paths with spaces.
  - Now:
    - Awaiting user test of `Run_Ralph.bat` to confirm TUI launches.
  - Next:
    - If Bun TUI still crashes, create a --no-tui fallback launcher or use WSL.
Open questions (UNCONFIRMED if needed):
- Does the TUI launch correctly now, or does Bun still crash?
Working set (files/ids/commands):
- `C:\Users\treyt\OneDrive\Desktop\pt-study-sop\Run_Ralph.bat`
