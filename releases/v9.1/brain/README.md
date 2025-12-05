# PT Study Brain — Analytics & Tracking System

## Purpose
Track study sessions, identify patterns, measure progress, and inform metacognition. The Brain stores data locally and generates insights to guide your learning.

---

## Quick Start

### After Each Session
```bash
# 1. Copy template
cp brain/session_logs/TEMPLATE.md brain/session_logs/2025-12-04_rotator_cuff.md

# 2. Fill in session data (edit the file)

# 3. Ingest to database
python brain/ingest_session.py brain/session_logs/2025-12-04_rotator_cuff.md
```

### Before Starting a Session
```bash
# Generate resume for context
python brain/generate_resume.py

# Paste output into GPT at session start
```

### Review Progress
```bash
# Command line dashboard
python brain/dashboard.py

# Web dashboard (opens in browser)
python brain/dashboard_web.py
```

---

## File Structure

```
brain/
├── README.md              ← You are here
├── config.py              ← Database and path configuration
├── db_setup.py            ← Initialize/reset database
├── ingest_session.py      ← Parse and store session logs
├── generate_resume.py     ← Create context for new sessions
├── dashboard.py           ← CLI analytics
├── dashboard_web.py       ← Browser-based dashboard
├── data/
│   └── pt_study.db        ← SQLite database
├── session_logs/
│   ├── TEMPLATE.md        ← Copy this for each session
│   └── [session files]    ← Your logged sessions
└── output/
    └── [generated files]  ← Resumes, reports, exports
```

---

## What Gets Tracked

### Session-Level Data
- Date, time, duration
- Topic and study mode
- Frameworks used
- Gated Platter triggers
- Cards created
- Self-ratings (understanding, confidence, system)

### Derived Analytics
- Topic coverage map (what's been studied, what's missing)
- Mode distribution (Core vs Sprint vs Drill usage)
- Framework effectiveness (which frameworks correlate with higher ratings)
- Calibration tracking (confidence vs actual performance over time)
- Session efficiency (understanding gained per time spent)
- Gap detection (topics not reviewed recently)

---

## Dashboard Metrics

### Coverage View
Shows all topics studied and recency:
- 🟢 Recent (within 7 days)
- 🟡 Fading (8-14 days)
- 🔴 Stale (15+ days)
- ⚫ Never studied

### Readiness Score
Estimates test readiness based on:
- Topic coverage (% of target topics studied)
- Recency (weighted by how recently studied)
- Confidence ratings (self-assessed)
- Review cycles (spaced repetition proxy)

**Not a guarantee** — just an informed estimate to guide decisions.

### Strength/Weakness Map
Based on logged ratings and Gated Platter triggers:
- **Strengths:** High ratings, no platter triggers, successful Sprint runs
- **Weaknesses:** Low ratings, platter triggers, repeated misses

### Pattern Detection
Looks for:
- Topics that always get low confidence
- Frameworks that correlate with better outcomes
- Time-of-day effects on ratings
- Mode effectiveness by topic type

---

## Calibration Tracking

### What It Is
Compares your **confidence rating** (how well you think you know it) with **actual performance** (Sprint misses, exam results if logged).

### Why It Matters
Poor calibration = bad study decisions. If you're overconfident on weak areas, you'll skip studying what you actually need.

### How to Use
- Log confidence honestly (don't inflate)
- Track Sprint mode results
- Review calibration trends in dashboard
- Adjust study priorities based on gaps

---

## Weekly Review Questions

Run `python brain/dashboard.py --weekly` to see:

1. **Coverage:** What topics did I study? What did I skip?
2. **Patterns:** Any topics consistently weak? Any frameworks not used?
3. **Calibration:** Was my confidence accurate? Where was I wrong?
4. **Efficiency:** Time spent vs understanding gained?
5. **Next week:** What should I prioritize?

---

## Commands

```bash
# Initialize database (first time or reset)
python brain/db_setup.py

# Ingest a session log
python brain/ingest_session.py brain/session_logs/FILENAME.md

# Generate resume for GPT
python brain/generate_resume.py

# View dashboard (CLI)
python brain/dashboard.py

# View dashboard (web)
python brain/dashboard_web.py

# Export data
python brain/dashboard.py --export csv
```

---

## Integration with SOP

### Session Start
1. Run `generate_resume.py`
2. Paste resume into GPT
3. GPT knows your recent context

### Session End
1. Complete WRAP phase in GPT
2. Copy session summary
3. Fill template and ingest

### Weekly Review
1. Run dashboard
2. Identify patterns and gaps
3. Set priorities for next week

---

## Data Privacy

All data stays local on your machine. Nothing is sent anywhere.

The database (`pt_study.db`) is a SQLite file you can:
- Back up by copying the file
- Reset by running `db_setup.py`
- Export with dashboard commands
- Delete entirely if needed
