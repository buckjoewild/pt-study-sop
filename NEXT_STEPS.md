# Next Steps — Implementation Checklist

## IMMEDIATE (This Week)

### 1. Test the Current System (Do First)
- [ ] Create CustomGPT with `sop/gpt-instructions.md`
- [ ] Run 3 real study sessions using the full protocol
- [ ] Note friction points, confusion, things that don't work
- [ ] Document in a feedback log

### 2. Update Brain Session Template
The current template doesn't capture v9.1 features.

**Add these fields to `brain/session_logs/TEMPLATE.md`:**
```markdown
## Planning Phase
- Target Exam/Block: [e.g., Anatomy Final - Lower Limb]
- Source-Lock: [List specific materials used]
- Plan of Attack: [3-5 steps planned]

## Anatomy-Specific (if applicable)
- Region Covered: [e.g., Posterior Hip]
- Landmarks Mastered: [List]
- Muscles Attached: [List]
- Rollback Events: [Yes/No - if yes, what triggered]
- Drawing Used: [Yes/No]
```

### 3. Update Brain Database Schema
**Add columns to `brain/db_setup.py`:**
```python
target_exam TEXT,
source_lock TEXT,
plan_of_attack TEXT,
region_covered TEXT,
landmarks_mastered TEXT,
muscles_attached TEXT,
rollback_events TEXT,
drawing_used TEXT
```

---

## SHORT-TERM (Next 2 Weeks)

### 4. Build Readiness Score Calculator
Create `brain/analytics.py` with:
- Topic coverage percentage
- Recency weighting
- Confidence averaging
- Gap identification

### 5. Create Anatomy Content Library Structure
```
sop/content/
├── landmarks/
│   ├── pelvis.md
│   ├── hip.md
│   ├── thigh.md
│   ├── knee.md
│   ├── leg.md
│   └── foot.md
├── drawings/
│   ├── rotator-cuff.md
│   ├── hip-muscles.md
│   └── knee-ligaments.md
└── clinical/
    ├── common-injuries.md
    └── gait-patterns.md
```

### 6. Update Resume Generator
Make `brain/generate_resume.py` output:
- Readiness score
- Topics covered with recency
- Weak areas needing attention
- Landmarks mastered (for anatomy)
- Suggested next session focus

---

## MEDIUM-TERM (Next Month)

### 7. Build Dashboard Web Interface
Rewrite `brain/dashboard_web.py` with:
- Visual topic heat map
- Readiness gauge
- Spacing alerts ("Topic X due for review")
- Session history timeline

### 8. Create Clinical Pathology Engine
`sop/modules/pathology-engine.md`:
- Diagnosis reasoning protocol
- Mechanism chain building
- Sign/symptom → test → confirmation flow
- Integration with M8 framework

### 9. Create Exam Tracking System
```
brain/exams/
├── anatomy-final.json
├── clin-path-exam3.json
└── exam-template.json
```

Each exam file defines:
- Topics required
- Learning objectives
- Date
- Current coverage status

---

## ONGOING

### 10. Research & Iterate
- Pick one topic from `RESEARCH_TOPICS.md` per week
- Read 2-3 papers or summaries
- Update relevant methods file
- Test improvement in real sessions

### 11. Document Session Learnings
After each study session:
- Log to Brain
- Note what worked/didn't
- Identify SOP improvement opportunities
- Update system as needed

---

## FILE UPDATES NEEDED

| File | Update | Priority |
|------|--------|----------|
| `brain/session_logs/TEMPLATE.md` | Add v9.1 fields | **NOW** |
| `brain/db_setup.py` | Add new columns | **NOW** |
| `brain/ingest_session.py` | Parse new fields | **NOW** |
| `brain/generate_resume.py` | Include new data | This week |
| `brain/analytics.py` | Create new | This week |
| `brain/dashboard_web.py` | Rewrite | 2 weeks |
| `sop/content/landmarks/` | Create structure | 2 weeks |
| `sop/modules/pathology-engine.md` | Create | 1 month |

---

## SUCCESS METRICS

After implementation, you should be able to:

1. **Start a session** → GPT runs Planning Phase → Source-Lock established
2. **Study anatomy** → Bone-first protocol enforced → Landmarks before OIAN
3. **Log session** → All v9.1 fields captured → Database updated
4. **Generate resume** → See readiness score → Know weak areas → Get next focus
5. **Check dashboard** → Visual coverage map → Spacing alerts → Calibration trends

---

## QUICK START TODAY

**Minimum viable test:**

1. Copy `sop/gpt-instructions.md` into a new CustomGPT
2. Start a conversation with `sop/runtime-prompt.md` pasted
3. Run a 30-minute anatomy session (pick one region)
4. Complete WRAP phase
5. Note what worked and what didn't

**Document feedback in:** `brain/session_logs/test_session_YYYY-MM-DD.md`
