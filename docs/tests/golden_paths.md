# Golden Paths (Acceptance Tests)

## GP1 — First Session, No Preloaded Data
- Create WRAP with course + topic.
- Brain ingests and creates Course + Topic.
- Dashboard shows default daily queue.

## GP2 — Standard Session
- Obsidian notes → Tutor WRAP → Brain ingest.
- Metrics + issues updated in DB.
- Obsidian note appended with WRAP highlights.

## GP3 — Source-Lock Missing
- Tutor marks output unverified.
- Brain creates `source_missing` issue.
- Dashboard flags missing sources.

## GP4 — Calendar Sync
- OAuth connected.
- `/api/gcal/sync` pulls events into `course_events`.
- Calendar page shows events.

## GP5 — Anki Drafts
- WRAP produces anchors + misses.
- Brain generates Q/A + Cloze + Image drafts.
