Goal (incl. success criteria):
- Refactor Scholar orchestrator prompt for focus and better outputs.
- Success criteria:
  1. Add explicit output format (5-bullet summary, ⚡ actions, ⚠️ warnings). ✓
  2. Consolidate into 3 phases (Audit, Research, Synthesize). ✓
  3. Add high-utility technique checklist (Dunlosky research). ✓
  4. Add weekly digest trigger. ✓
  5. Add probe-before-teach rule. ✓
  6. Reduce verbosity (1-2 page dossiers, 5-10 bullet notes). ✓

Constraints/Assumptions:
- Keep unattended mode instructions at top.
- Keep safety guardrails (never modify code).
- Target ~100 lines.

Key decisions:
- Replaced multi-step execution cycle with 3 clear phases.
- Added Dunlosky technique table for quick reference.
- Weekly digest triggers on Friday+ or 7+ days since last.

State:
  - Done: Orchestrator prompt refactored.
  - Now: Complete.
  - Next: User validation.

Open questions (UNCONFIRMED if needed):
- None.

Working set (files/ids/commands):
- scholar/workflows/orchestrator_run_prompt.md

Notes:
- Study RAG directory can be overridden via env var PT_STUDY_RAG_DIR (currently set in Run_Brain_All.bat to C:\Users\treyt\OneDrive\Desktop\PT School)
