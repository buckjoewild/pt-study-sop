Goal (incl. success criteria):
- Fix release_check.py/_smoke_test.py so release_check passes, then remove Typecheck waivers from US-001..US-007.

Constraints/Assumptions:
- Follow pt-study-sop AGENTS.md; update this Continuity Ledger each turn and on state changes.
- Keep changes minimal and scoped; avoid destructive actions without confirmation.
- Use scripts/ralph runbook; required checks: python -m pytest brain/tests; python scripts/release_check.py.

Key decisions:
- Continue on branch main.

State:
  - Done:
    - Updated _smoke_test.py to avoid pytest collection side effects.
    - pytest brain/tests passed; release_check.py passed on Windows.
    - Removed waiver notes from scripts/ralph/prd.json.
  - Now:
    - Stage and commit release_check fix + waiver cleanup.
  - Next:
    - (Optional) push commits if desired.

Open questions (UNCONFIRMED if needed):
- None.

Working set (files/ids/commands):
- C:\Users\treyt\OneDrive\Desktop\pt-study-sop\_smoke_test.py
- C:\Users\treyt\OneDrive\Desktop\pt-study-sop\scripts\ralph\prd.json
- C:\Users\treyt\OneDrive\Desktop\pt-study-sop\scripts\ralph\progress.txt
- C:\Users\treyt\OneDrive\Desktop\pt-study-sop\CONTINUITY.md
