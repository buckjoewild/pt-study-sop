# WRAP Schema (Minimum Contract)

## Purpose
Define the minimum WRAP payload required for Brain ingestion and metrics.

## Required Fields
- `session_id`
- `date`
- `course`
- `topic`
- `mode`
- `duration_min`
- `source_lock`
- `understanding`
- `retention`
- `calibration_gap`
- `retrieval_success_rate`
- `anchors`
- `weak_anchors`
- `what_worked`
- `what_needs_fixing`
- `wrap_watchlist`
- `exit_ticket_blurt`
- `exit_ticket_muddiest`
- `next_session`

## Optional Fields
- `topics` (array)
- `confusables`
- `glossary`
- `anki_cards`
- `spaced_reviews`
- `notes`

## Invariants
- `session_id` is deterministic for idempotency.
- `date` uses ISO format `YYYY-MM-DD`.
- Lists are semicolon‑separated when in string form.
