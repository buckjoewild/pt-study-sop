# Next Steps – Implementation Checklist

> Guardrails (apply to every change)
> - Check `MASTER_PLAN_PT_STUDY.md`: no invariant violations.
> - Check contracts/schemas (session_log, card, RAG doc, resume): no breaking changes.
> - If a contract must change, update `MASTER_PLAN_PT_STUDY.md` explicitly.

## ƒo. COMPLETED (v9.1)

- [x] Create condensed GPT instructions (under 8k chars)
- [x] Package release in `releases/v9.1/`
- [x] Update Brain schema to v9.1
- [x] Update session template with new fields
- [x] Update ingest script for new fields
- [x] Update resume generator with readiness score
- [x] Migrate existing database
- [x] Update all README files
- [x] Update CHANGELOG

---

## IMMEDIATE (This Week)

### 1. Test the System
- [ ] Create CustomGPT with `releases/v9.1/GPT-INSTRUCTIONS.md`
- [ ] Upload all 14 knowledge files from `releases/v9.1/gpt-knowledge/`
- [ ] Run 3 real study sessions
- [ ] Note friction points in a feedback log
- [ ] Document what works and what doesn't

### 2. First Session Test
- [ ] Say "Let's study anatomy - posterior hip"
- [ ] Complete Planning Phase
- [ ] Study with Seed-Lock enforcement
- [ ] Use "wrap" to end session
- [ ] Log session using template
- [ ] Run ingest script

---

## SHORT-TERM (Next 2 Weeks)

### 3. Iterate Based on Testing
- [ ] Fix any issues discovered in testing
- [ ] Adjust GPT instructions if needed
- [ ] Update knowledge files if needed

### 4. Build Dashboard Web UI
- [ ] Create `brain/dashboard_web_v2.py`
- [ ] Topic heat map visualization
- [ ] Readiness gauge
- [ ] Spacing alerts
- [ ] Session history timeline

### 5. Create Anatomy Content Library Structure
```
sop/content/
├── landmarks/
├── drawings/
└── clinical/
```

---

## MEDIUM-TERM (Next Month)

### 6. Build Clinical Pathology Engine
- [ ] Create `sop/modules/pathology-engine.md`
- [ ] Diagnosis reasoning protocol
- [ ] Mechanism chain building
- [ ] Integration with M8 framework

### 7. Create Exam Tracking
- [ ] Define exam structure in `brain/exams/`
- [ ] Coverage tracking per exam
- [ ] Learning objective mapping
- [ ] Countdown/urgency awareness

---

## ONGOING

### 8. Research & Iterate
- [ ] Pick one topic from `RESEARCH_TOPICS.md` per week
- [ ] Read 2-3 papers or summaries
- [ ] Update relevant methods file
- [ ] Test improvement in real sessions

### 9. Document Session Learnings
- [ ] Log to Brain
- [ ] Note what worked/didn't
- [ ] Identify SOP improvement opportunities

---

## Quick Start Today

**Minimum viable test:**

1. Go to `releases/v9.1/`
2. Copy `GPT-INSTRUCTIONS.md` into new CustomGPT Instructions field
3. Upload all 14 files from `gpt-knowledge/` to Knowledge
4. Start conversation: "Let's study anatomy - pick a region"
5. Complete a 30-minute session
6. Say "wrap" to end
7. Create log file and run ingest

Document feedback in: `brain/session_logs/test_session_YYYY-MM-DD.md`

---

## Success Metrics

After implementation, you should be able to:

1. Start a session → GPT runs Planning Phase → Source-Lock established
2. Study anatomy → Bone-first protocol enforced → Landmarks before OIAN
3. Log session → All v9.1 fields captured → Database updated
4. Generate resume → See readiness score → Know weak areas
5. Check dashboard → Visual coverage map → Spacing alerts (not yet built)
