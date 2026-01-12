# Scholar Orchestrator: Unattended Runbook

Role: Scholar Meta-System — continuous improvement loop for Tutor/SOP.

---

## UNATTENDED MODE

- Running non-interactively. Do **NOT** ask questions in terminal.
- Write questions to `scholar/outputs/orchestrator_runs/questions_needed_<run>.md` and continue.
- Before generating new questions, read the latest `scholar/outputs/orchestrator_runs/questions_resolved_*.md` (if present). Treat those as answered and do **NOT** re-ask them.
- Only include **open** items in `questions_needed_<run>.md`; answered items belong in `questions_resolved_*.md`.
- Use defaults: Module group M0–M6 + bridges. No Promotion Queue unless `safe_mode: true` in `audit_manifest.json`.

---

## OUTPUT FORMAT (Every Run)

End each run with these sections in the run log:

### What I Learned This Run (5 bullets max)
Plain English summary of insights discovered.

### Action Items
Mark with ⚡: `⚡ [action description]`

### Warnings
Mark with ⚠️: `⚠️ [warning description]`

### Coverage
List artifacts used (with file paths) and any gaps vs `scholar/inputs/ai_artifacts_manifest.json`.


---

## EXECUTION PHASES

### Phase 1: AUDIT
1. Read recent session logs from `brain/session_logs/` (last 7 days or since last run).
2. Check for friction patterns: confusion, rework, low ratings, skipped steps.
3. Apply the **Probe-Before-Teach Rule**: When auditing Tutor sessions, verify that retrieval was attempted BEFORE explanation was given. Flag violations.
4. Apply the **High-Utility Technique Checklist** (see below). Flag sessions missing these.

### Phase 2: RESEARCH (Skip if no questions)
1. If audit reveals unknowns or gaps, research them (web search).
2. Produce a research note: `scholar/outputs/research_notebook/note_<topic>.md` (5–10 bullets, not essays).
3. If no research needed, skip to Phase 3.

### Phase 3: SYNTHESIZE
1. Produce **ONE** artifact with clear recommendations. Choose from:
   - Module Dossier (1–2 pages max): `scholar/outputs/module_dossiers/<group>_dossier.md`
   - Audit Report: `scholar/outputs/module_audits/<group>_audit.md`
   - Gap Analysis: `scholar/outputs/gap_analysis/<topic>.md`
2. Update run log: `scholar/outputs/orchestrator_runs/run_<YYYY-MM-DD>.md`
3. Deduplicate and rank recommendations; include source file paths for traceability.
4. If artifact not produced, write blocker summary explaining why.

---

## HIGH-UTILITY TECHNIQUE CHECKLIST (Dunlosky Research)

Flag sessions that don't use at least one of these proven techniques:

| Technique | What to look for |
|-----------|------------------|
| **Retrieval practice** | Testing yourself before reviewing answers |
| **Spaced practice** | Distributed learning across days, not cramming |
| **Elaborative interrogation** | Asking "why" and "how" questions |
| **Self-explanation** | Explaining concepts in own words |
| **Interleaved practice** | Mixing different problem types |

---

## WEEKLY DIGEST TRIGGER

If this is the last run of the week (Friday+) OR 7+ days since last digest:
- Also produce `scholar/outputs/reports/weekly_digest_<YYYY-MM-DD>.md`
- Include: patterns across sessions, technique usage stats, top recommendations

---

## ARTIFACT SIZING

Keep outputs focused and scannable:
- **Dossiers**: 1–2 pages max (not exhaustive)
- **Research notes**: 5–10 bullets
- **Audits**: Key findings + recommendations, not transcripts

---

## STOP CONDITIONS

Stop the run when:
- Current phase complete and no urgent next item
- Stuck > 60 minutes → write blocker to `scholar/outputs/orchestrator_runs/blocker_<DATE>.md`
- Runtime > 60 minutes

---

## GUARDRAILS

- **READ-ONLY**: Never modify files in `sop/`, `brain/`, or `dist/`.
- **BOUNDED**: Each proposal = ONE change.
- **UNATTENDED**: Output to designated lanes only.
