# PT Study SOP v9.1 — Gap Analysis & Roadmap

## Current State: v9.1 Complete

### ✅ COMPLETE
- [x] M0-M6 modules documented
- [x] Anatomy Engine with bone-first protocol
- [x] Frameworks (H-Series, M-Series, Levels)
- [x] Methods library (5 learning science docs)
- [x] Drawing protocol for anatomy
- [x] Condensed GPT instructions (under 8k chars)
- [x] Packaged release in `releases/v9.1/`
- [x] Brain v9.1 schema with anatomy tracking
- [x] Session template with all v9.1 fields
- [x] Resume generator with readiness score
- [x] Database migration from v8

---

## Remaining Gaps

### GAP 1: Brain Analytics Dashboard
**Status:** Not started  
**Priority:** High

**Current:** Basic resume generation only

**Needed:**
- [ ] Visual topic heat map
- [ ] Readiness gauge visualization
- [ ] Spacing alerts ("Topic X due for review")
- [ ] Confidence vs performance calibration chart
- [ ] Session history timeline

**Action:** Rewrite `dashboard_web.py` with web UI

---

### GAP 2: Subject-Specific Engines
**Status:** Anatomy Engine complete, others not started  
**Priority:** Medium

**Current:** Only Anatomy Engine exists

**Needed:**
- [ ] Clinical Pathology Engine (diagnosis reasoning, mechanism chains)
- [ ] Lifespan Development Engine (age-stage progressions)
- [ ] Legal & Ethical Engine (case-based reasoning)
- [ ] Examination Skills Engine (procedure sequences)

**Action:** Create engine template, build pathology engine first

---

### GAP 3: Content Libraries
**Status:** Not started  
**Priority:** Medium

**Current:** AI generates everything dynamically

**Needed:**
- [ ] Landmark library for common anatomy regions
- [ ] Pre-built drawing instructions for high-yield structures
- [ ] OIAN quick-reference sheets per region
- [ ] Clinical pattern libraries

**Action:** Create `sop/content/` directory structure

---

### GAP 4: Exam Tracking System
**Status:** Not started  
**Priority:** Lower

**Current:** Sessions logged individually, no exam grouping

**Needed:**
- [ ] Exam/block definitions (topics per exam)
- [ ] Coverage tracking per exam
- [ ] Countdown/urgency awareness
- [ ] Learning objective mapping

**Action:** Create `brain/exams/` with exam definition files

---

### GAP 5: Integration Tests
**Status:** Not started  
**Priority:** Lower

**Current:** No way to verify GPT behavior

**Needed:**
- [ ] Test prompts with expected behaviors
- [ ] Validation checklist for new GPT setup
- [ ] Sample session transcripts

**Action:** Create `sop/tests/` with validation scenarios

---

## Implementation Priority

| Phase | Focus | Timeline |
|-------|-------|----------|
| **Current** | Test v9.1 with real sessions | This week |
| **Phase 1** | Dashboard web UI | 2 weeks |
| **Phase 2** | Content libraries | 2-4 weeks |
| **Phase 3** | Additional engines | 1 month |
| **Phase 4** | Exam tracking | As needed |

---

## Next Immediate Steps

1. **Test v9.1** — Run 3 real study sessions with the CustomGPT
2. **Note friction** — Document what doesn't work
3. **Iterate** — Fix issues before building new features
4. **Build dashboard** — Visual analytics for Brain data

---

## Files Reference

| Document | Location |
|----------|----------|
| Current release | `releases/v9.1/` |
| Research topics | `RESEARCH_TOPICS.md` |
| Next steps checklist | `NEXT_STEPS.md` |
| Changelog | `CHANGELOG.md` |
