# PT Study SOP v9.2 (dev) – Master Reference
**Version:** 9.2 (development)
**Updated:** December 8, 2025
**Owner:** Trey Tucker

---
## Quick Navigation
| File | Purpose |
|------|---------|
| `gpt-instructions.md` | CustomGPT system prompt |
| `runtime-prompt.md` | Session start script |
| `modules/` | M0–M6 protocols |
| `modules/anatomy-engine.md` | Anatomy engine (OIANA+ with arterial, mnemonics, manual image drill) |
| `frameworks/` | H-Series, M-Series, Levels |

---
## System Overview
- User generates; AI validates/scaffolds.
- Function before structure; Seed-Lock; Level gating; Visual-first for anatomy.
- Desirable difficulties: test/struggle with feedback.

### Session Flow
```
M0 (Planning) → M1 (Entry) → M2 (Prime) → M3 (Encode) → M4 (Build) → M6 (Wrap)
                                      ↑
                                   M5 (Modes)
```
**Anatomy:** M0 → Anatomy Engine → M6, order = Bones → Landmarks → Attachments → Actions → Nerves → Arterial → Clinical.

---
## Module Snapshot (v9.2 updates)
- **M0 Planning:** target + sources + 3–5 step plan + 1–3 item pre-test/brain dump (mandatory).
- **M1 Entry:** focus/energy check; choose mode (Core/Sprint/Drill/Light/Quick Sprint); load prior context.
- **M2 Prime:** concise H1 scan (≤2 short paras or ≤6 bullets); buckets (2–4); optional H2 by request; label-a-diagram prime with blanks/worksheets.
- **M3 Encode:** function-first using M-Series (default M2 Trigger); toolkit = dual code, example→problem, self-explain, segment/paraphrase, generate & check; fading from worked → partial → independent.
- **M4 Build:** toolkit = interleave, space (successive relearning 2–3 correct recalls), variability, progressive ladder, retrieval+explain, feedback with explanations, error reflection; ramp template; timing for standard/micro blocks.
- **M5 Modes:** Core, Sprint, Drill plus **Light (10–15 min)** and **Quick Sprint (20–30 min)** presets; card quotas and fatigue/break rules; switch heuristics (Core→Sprint ~80–90%, Sprint→Drill on repeated misses, etc.).
- **M6 Wrap:** 2–10 min; cards required for misses; image drill misses → cards; glossary entries (1–2 sentence defs); spacing plan (1d/3d/7d; 2–3 correct recalls before mastered); quick test + confidence check.

---
## Anatomy Engine (key points)
- Order: Bones → Landmarks → Attachments (O/I) → Actions → Nerves → Arterial Supply → Clinical.
- Arterial step: capture primary artery; recall Q: “Which artery supplies this muscle?”
- Mnemonic command: `mnemonic` after understanding; 3 options; avoid homophones unless requested.
- Manual image drill: unlabeled → identify → reveal labels using blank/printed sheets; convert misses to cards in Wrap. Live fetch is parked until external service exists.
- Glossary: capture short definitions per region during Wrap.
- Rollback: if OIANA+ shaky, return to landmarks → attachments → re-layer O/A/N/Arterial.

---
## Frameworks Quick Reference
- **H-Series:** H1 System (default), H2 Anatomy (opt-in).
- **M-Series:** M2 Trigger (default), M6 Homeostasis, M8 Diagnosis, Y1 Generalist.
- Default: function before structure; keep scans concise; mark unverified if no sources.

---
## Commands (runtime)
`plan`, `ready`, `bucket`, `mold`, `wrap`, `draw`, `landmark`, `rollback`, `mode core/sprint/drill/light/quick-sprint`, `mnemonic`, `menu`.

---
## Brain Integration (unchanged scope)
- Run `python brain/db_setup.py`; tests: `python -m pytest brain/tests`.
- Ingest sessions via `brain/ingest_session.py`; dashboard `python brain/dashboard.py`.
- Keep `releases/v9.1/` frozen until promotion; v9.2 staging lives here.


## Engines
- Anatomy Engine: use for anatomy/spatial topics (OIANA+).
- Concept Engine: default for non-anatomy topics (definition → context → mechanism → boundary → application).

## Modes/Prompts Note
- For complex problems, use /fade (worked → completion → independent).
- Non-anatomy: Concept Engine is the default; anatomy: Anatomy Engine.

