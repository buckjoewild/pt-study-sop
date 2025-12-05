# PT Study SOP v9.1 — Gap Analysis & Roadmap

## Current State Assessment

### ✅ COMPLETE — Core SOP Structure
- [x] M0-M6 modules documented
- [x] Anatomy Engine with bone-first protocol
- [x] Frameworks (H-Series, M-Series, Levels)
- [x] Methods library (5 learning science docs)
- [x] Drawing protocol for anatomy
- [x] gpt-instructions.md for CustomGPT
- [x] runtime-prompt.md for session starts
- [x] Examples (gated-platter, sprint-dialogue, commands)

### ✅ COMPLETE — Brain Infrastructure
- [x] SQLite database schema
- [x] Session logging template
- [x] Ingest script (parse markdown → database)
- [x] Resume generator
- [x] Basic dashboard scripts

### ⚠️ GAPS — Needs Work

---

## GAP 1: Brain Database Schema Incomplete

**Current schema tracks:**
- Session metadata (date, time, topic, mode, duration)
- Ratings (understanding, confidence, system performance)
- Frameworks used, gated platter triggers
- Free-text reflections

**Missing for v9.1 features:**
- [ ] Landmarks mastered per session
- [ ] Attachment maps completed
- [ ] Rollback events (when OIAN failed → returned to landmarks)
- [ ] Source-Lock tracking (which materials were used)
- [ ] Plan of Attack tracking
- [ ] Drawing usage
- [ ] Specific anatomy regions covered
- [ ] Calibration data (predicted vs actual performance)

**Action:** Update `db_setup.py` with extended schema

---

## GAP 2: Brain Analytics Dashboard Outdated

**Current dashboard shows:**
- Recent sessions list
- Topic coverage (basic)
- Score averages

**Missing analytics:**
- [ ] Readiness Score calculation
- [ ] Topic heat map visualization
- [ ] Confidence vs performance calibration tracking
- [ ] Anatomy-specific coverage (regions, landmarks, muscles)
- [ ] Spacing analysis (time since last review per topic)
- [ ] Weakness detection (repeated low scores, rollback patterns)
- [ ] Framework effectiveness correlation
- [ ] Weekly review summary generation

**Action:** Rewrite `dashboard.py` and `dashboard_web.py` with new analytics

---

## GAP 3: No Subject-Specific Engines

**Current:** Only Anatomy Engine exists

**Missing engines for other courses:**
- [ ] Clinical Pathology Engine (diagnosis reasoning, mechanism chains)
- [ ] Lifespan Development Engine (age-stage progressions)
- [ ] Legal & Ethical Engine (case-based reasoning, decision trees)
- [ ] Examination Skills Engine (procedure sequences, patient positioning)

**Action:** Create modular engine templates that can be enabled per session

---

## GAP 4: No Pre-Built Content Libraries

**Current:** AI generates everything dynamically

**Missing:**
- [ ] Landmark library for common anatomy regions (pelvis, shoulder, knee, etc.)
- [ ] Drawing instruction library (pre-built for high-yield structures)
- [ ] OIAN quick-reference sheets per region
- [ ] Clinical pattern libraries (common injury → test → findings)

**Action:** Build content library structure in `sop/content/` or `sop/libraries/`

---

## GAP 5: No Exam/Block Tracking System

**Current:** Sessions logged individually

**Missing:**
- [ ] Exam/block definitions (what topics belong to which exam)
- [ ] Coverage tracking per exam
- [ ] Countdown/urgency awareness
- [ ] Learning objective mapping

**Action:** Add `brain/exams/` structure with exam definitions and tracking

---

## GAP 6: No Integration Tests

**Current:** No way to verify SOP works correctly in CustomGPT

**Missing:**
- [ ] Test prompts with expected behaviors
- [ ] Validation checklist for new GPT setup
- [ ] Sample session transcripts showing correct behavior

**Action:** Create `sop/tests/` with validation scenarios

---

## GAP 7: Brain Resume Format Needs Update

**Current resume generator:** Basic session list

**Needed for v9.1:**
- [ ] Include landmarks mastered
- [ ] Include anatomy regions covered
- [ ] Include rollback events
- [ ] Include readiness estimate
- [ ] Prioritized weak areas

**Action:** Update `generate_resume.py` to match new schema

---

## GAP 8: No Spaced Repetition Tracking

**Current:** Anki card count logged, but no spacing analysis

**Missing (even without in-GPT spaced repetition):**
- [ ] Time-since-last-review per topic
- [ ] Optimal review timing suggestions
- [ ] Decay estimates based on confidence ratings
- [ ] "Due for review" alerts

**Action:** Add spacing calculations to dashboard analytics

---

## IMPLEMENTATION PRIORITY

### Phase 1: Brain Schema Update (Critical)
1. Update `db_setup.py` with extended schema
2. Update `ingest_session.py` to parse new fields
3. Update `TEMPLATE.md` with new fields
4. Migrate existing data (if any)

### Phase 2: Dashboard Overhaul (High)
1. Readiness Score calculation
2. Topic heat map
3. Spacing analysis
4. Weakness detection

### Phase 3: Content Libraries (Medium)
1. Anatomy landmark library structure
2. Drawing instruction library
3. Clinical pattern templates

### Phase 4: Additional Engines (Medium)
1. Clinical Pathology Engine
2. Generic engine template for other courses

### Phase 5: Exam Tracking (Lower)
1. Exam definition structure
2. Coverage tracking
3. LO mapping

---

## NEXT IMMEDIATE STEPS

1. **Update Brain schema** — Add new fields for v9.1 features
2. **Update session template** — Match new schema
3. **Test with 3 real sessions** — Validate full flow works
4. **Iterate based on friction** — What's annoying? What's missing?

---

## Files to Create/Update

| File | Action | Priority |
|------|--------|----------|
| `brain/db_setup.py` | Add new columns | High |
| `brain/ingest_session.py` | Parse new fields | High |
| `brain/session_logs/TEMPLATE.md` | Add new fields | High |
| `brain/generate_resume.py` | Include new data | High |
| `brain/dashboard.py` | Full rewrite | High |
| `brain/analytics.py` | New file for calculations | Medium |
| `sop/modules/pathology-engine.md` | New engine | Medium |
| `sop/content/landmarks/` | Content library | Medium |
| `brain/exams/` | Exam tracking | Lower |
| `sop/tests/` | Validation scenarios | Lower |
