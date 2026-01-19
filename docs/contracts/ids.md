# Core IDs (Stable Identifiers)

## Purpose
Provide consistent identifiers so data is durable across terms and courses.

## IDs
- `term_id`: Optional semester/term container (string).
- `course_id`: Stable slug (e.g., `anatomy-2-s25`).
- `topic_id`: Slug for a topic (e.g., `brachial-plexus`).
- `session_id`: Unique session slug (e.g., `2026-01-20_anatomy_brachial-plexus_core`).
- `assessment_id`: Unique assessment slug (e.g., `anatomy-2-s25_midterm`).
- `issue_id`: Unique issue slug (e.g., `issue_2026-01-20_brachial-plexus_recall`).
- `card_id`: Unique card slug (e.g., `card_2026-01-20_brachial-plexus_01`).

## Rules
- IDs are lowercase, hyphenated, and stable across runs.
- `session_id` is deterministic and re-used for idempotent updates.
- If a slug collision occurs, append a short suffix (e.g., `-02`).
