Goal (incl. success criteria):
- For the Ralph loop, pick the highest priority story in `scripts/ralph/prd.json` with `passes: false`, implement it, run required checks, update `AGENTS.md`, `scripts/ralph/prd.json`, and `scripts/ralph/progress.txt`, then commit `feat: [ID] - [Title]`.

Constraints/Assumptions:
- Follow `AGENTS.md` and Ralph instructions; update this ledger each turn and on state changes.
- Stay on current branch; do not stage unrelated changes; prefer minimal ASCII edits.
- Required checks: `python -m pytest brain/tests`, `python scripts/release_check.py`, manual smoke if UI changes.
- If touching `scholar/`, it is read-only for `sop/`, `brain/`, `dist/` and outputs only in `scholar/outputs/`.

Key decisions:
- Use `scripts/ralph/prd.json` as the authoritative story list and `scripts/ralph/progress.txt` for patterns/learnings.
- Keep commits isolated to the current story (no unrelated staging).
- Run required checks via Windows `cmd.exe` because WSL `python` is unavailable.

State:
  - Done:
    - US-001 complete: `scholar/outputs/reports/scholar_loop_contract_2026-01-12.md`; commit `feat: US-001 - Define Scholar loop contract`.
    - US-002 complete: `scholar/outputs/reports/system_health_schema_2026-01-12.md`; commit `feat: US-002 - Specify system health schema`.
    - US-003 complete: `scholar/outputs/reports/system_health_2026-01-12.md`; commit `feat: US-003 - Produce system health report`.
    - Required checks run for completed stories via Windows Python.
    - Patched `scripts/ralph/ralph.sh`/`scripts/ralph/prompt.md` to avoid premature loop stop.
    - US-004 report drafted: `scholar/outputs/reports/questions_lifecycle_2026-01-12.md`.
    - Checks run: `cmd.exe /c "python -m pytest brain/tests"` and `cmd.exe /c "python scripts/release_check.py"`.
  - Now:
    - Stage and commit US-004 changes; update tracking already applied.
  - Next:
    - Continue to next highest-priority failing story after commit.

Open questions (UNCONFIRMED if needed):
- None.

Working set (files/ids/commands):
- `scripts/ralph/prd.json`
- `scripts/ralph/progress.txt`
- `AGENTS.md`
- `CONTINUITY.md`
- `git status -sb`
- `scholar/outputs/reports/questions_lifecycle_2026-01-12.md`
