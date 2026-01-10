Goal (incl. success criteria):
- Implement Tutor/Scholar/Brain integration (Phases 1-5) from 17-agent autonomous plan.
- Success: New tables (tutor_turns, card_drafts), Anki sync module, Scholar brain_reader, friction alerts, card draft API endpoints.

Constraints/Assumptions:
- Runtime Canon in sop/gpt-knowledge/ is authoritative.
- Master Plan in sop/MASTER_PLAN_PT_STUDY.md defines invariants.
- Preserve folder structure (sop/, brain/, scripts/, docs/, dist/). No destructive commands without approval.
- Phase 6 (Google Calendar sync) deferred - user requested skip.

Key decisions:
- Card draft workflow: Tutor creates draft -> User approves/edits -> Sync to Anki via Anki Connect.
- Scholar reads Brain data via READ-ONLY brain_reader.py (never writes to Brain DB).
- Friction alerts detect: high unverified ratio, short/long sessions, low understanding, missing WRAP, repeated topic struggles.
- Deduplication uses SequenceMatcher with 0.85 threshold for fuzzy matching.

State:
- Done:
  - Added tutor_turns table to db_setup.py (12 columns)
  - Added card_drafts table to db_setup.py (14 columns)
  - Created brain/anki_sync.py (Anki Connect integration ~500 lines)
  - Created brain/card_dedupe.py (fuzzy deduplication ~400 lines)
  - Created scholar/brain_reader.py (READ-ONLY DB access ~500 lines)
  - Created scholar/friction_alerts.py (friction detection ~450 lines)
  - Added card draft endpoints to routes.py (POST/GET/PATCH /api/cards/*)
- Now:
  - Run db_setup.py to create new tables
  - Verify no import errors
- Next:
  - Run tests (pytest brain/tests)
  - Update documentation

Open questions (UNCONFIRMED if needed):
- None currently

Working set (files/ids/commands):
- brain/db_setup.py (modified)
- brain/anki_sync.py (created)
- brain/card_dedupe.py (created)
- brain/dashboard/routes.py (modified)
- scholar/brain_reader.py (created)
- scholar/friction_alerts.py (created)

