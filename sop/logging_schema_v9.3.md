# Logging Schema v9.3 (Canonical)

## Purpose
Provide a single, consistent JSON logging format for all sessions.

---
## Formatting rules
- Valid JSON only (double quotes, commas, no comments).
- Use `YYYY-MM-DD` for dates.
- Use semicolon-separated values for list-like fields.
- No multiline strings; keep each value on one line.
- Use numbers for numeric fields (duration_min, ratings, percentages).
- Use "N/A" when a required field is unknown.

---
## Tracker JSON (required)
```json
{
  "schema_version": "9.3",
  "date": "YYYY-MM-DD",
  "topic": "Main topic",
  "mode": "Core",
  "duration_min": 45,
  "understanding": 4,
  "retention": 4,
  "calibration_gap": 10,
  "rsr_percent": 70,
  "cognitive_load": "intrinsic",
  "transfer_check": "yes",
  "anchors": "semicolon-separated",
  "what_worked": "semicolon-separated",
  "what_needs_fixing": "semicolon-separated",
  "notes": "semicolon-separated"
}
```

---
## Enhanced JSON (required)
```json
{
  "schema_version": "9.3",
  "date": "YYYY-MM-DD",
  "topic": "Main topic",
  "mode": "Core",
  "duration_min": 45,
  "understanding": 4,
  "retention": 4,
  "calibration_gap": 10,
  "rsr_percent": 70,
  "cognitive_load": "intrinsic",
  "transfer_check": "yes",
  "source_lock": "semicolon-separated",
  "plan_of_attack": "semicolon-separated",
  "frameworks_used": "semicolon-separated",
  "buckets": "semicolon-separated",
  "confusables_interleaved": "semicolon-separated",
  "anchors": "semicolon-separated",
  "anki_cards": "semicolon-separated",
  "glossary": "semicolon-separated",
  "exit_ticket_blurt": "semicolon-separated",
  "exit_ticket_muddiest": "semicolon-separated",
  "exit_ticket_next_action": "semicolon-separated",
  "retrospective_status": "semicolon-separated",
  "spaced_reviews": "R1=YYYY-MM-DD; R2=YYYY-MM-DD; R3=YYYY-MM-DD; R4=YYYY-MM-DD",
  "what_worked": "semicolon-separated",
  "what_needs_fixing": "semicolon-separated",
  "next_session": "semicolon-separated",
  "notes": "semicolon-separated"
}
```

---
## Required calculations
- calibration_gap = predicted performance (JOL) minus actual recall.
- rsr_percent = percent correct on retrieval attempts at session start.

---
## Spacing defaults (heuristic)
- R1 = +1 day
- R2 = +3 days
- R3 = +7 days
- R4 = +21 days

Adaptive adjustment:
- Red (struggled): move the next review sooner.
- Yellow (effortful success): keep standard spacing.
- Green (easy): extend the next interval.

---
## Compatibility notes
- Field names are fixed. Update downstream tools before changing keys.
- JSON must be valid; no trailing commas or multiline strings.
