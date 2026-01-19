# Metrics + Issues Contract

## Metrics
- **Readiness Score**: composite of understanding + retention + retrieval success.
- **Calibration Gap**: predicted vs actual (positive = overconfident).
- **Weak Areas**: topics with repeated misses or low retrieval rate.

## Issue Types
- Knowledge gap
- Process gap
- Scheduling gap
- Fatigue / energy gap
- Source missing

## Rules
- Any missing sources produce a `source_missing` issue.
- Calibration gap > 10 triggers a `calibration_drift` issue.
- Retrieval success < 70 triggers a `retrieval_gap` issue.
