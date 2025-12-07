# PT Study SOP v9.1 - Master Reference
**Version:** 9.1 "Structured Architect + Anatomy Engine"  
**Updated:** December 4, 2025  
**Owner:** Trey Tucker

---

## Quick Navigation
| File | Purpose |
|------|---------|
| `gpt-instructions.md` | CustomGPT system prompt (paste into GPT settings) |
| `runtime-prompt.md` | Session start script (paste at beginning of each session) |
| `modules/M0-M6` | Protocol steps in sequence |
| `modules/anatomy-engine.md` | Specialized anatomy learning protocol |
| `frameworks/` | H-Series, M-Series, Y-Series reference |
| `methods/` | Learning science foundations |
| `examples/` | Dialogue examples and command reference |

---

## System Overview (general-first)
An AI-assisted study system that enforces active learning through structured protocols. Built on Justin Sung priming/plan-first ideas and Jim Kwik hooks.

Core philosophy
1) User generates, AI validates/scaffolds.
2) Function before structure.
3) Gated progression (show understanding before advancing).
4) Desirable difficulties (productive struggle).
5) Source-first (RAG): prefer user-provided snippets; if none, mark outputs **unverified**.

Session flow
```
M0 (Planning) + M1 (Entry) + M2 (Prime) + M3 (Encode) + M4 (Build) + M6 (Wrap)
                                             ^
                                         M5 (Modes) modifies behavior
```

---

## Module Summary

### M0: Planning Phase
Purpose: establish target, sources, and plan before teaching.
Actions: target, status, gather materials, source-lock, 3-5 step plan. Exit: plan agreed.

### M1: Entry
Purpose: initialize state and mode. Actions: state check, scope, time/pressure, knowledge rating 1-5, mode select (see Modes). Exit: mode selected, scope locked.

### M2: Prime (MAP)
Purpose: survey and bucket before learning. Actions: System Scan using H-series; user buckets (2-5 buckets); "don’t memorize yet—just bucket." Exit: buckets ready.

### M3: Encode
Purpose: attach meaning to one bucket. Actions: pick bucket; apply M-series; phonetic override after quick teach-back; user Seed required (or Gated Platter); mark unverified if no source snippet. Exit: user owns a Seed.

### M4: Build (LOOP)
Purpose: construct through levels. Levels: L1 Metaphor; L2 10-year-old (must teach-back); L3 High School; L4 Clinical. Drawing/visual stories when helpful. Exit: understanding at target level.

### M5: Modes (behavior modifier)
Purpose: pick posture based on time + knowledge.
- Diagnostic Sprint (test-first) for short time and knowledge 3-5.
- Teaching Sprint for short time and knowledge 1-2 (micro-teach + check).
- Core for new/partial with normal time (full M2-M4 loop).
- Drill for weak anchors/misses. Handoff: Sprint/Teaching miss -> Drill.
Common: seed gate (override allowed with warning), RAG gate, visual stories optional for anatomy.

### M6: Wrap
Purpose: close and prep next. Actions: review locked anchors; select weak anchors; **draft Anki-ready cards by default for weak anchors**; confirm wording; generate session log; set next action. Exit: log complete, cards drafted, next step clear.

---

## Anatomy Engine (available, not default)
When doing anatomy, follow bone/landmark-first order (see `modules/anatomy-engine.md`). For general study, anatomy engine is optional.

---

## Key Mechanisms
- Seed-Lock (overrideable with warning)
- Gated Platter for stalls (user must edit the raw L1 metaphor)
- Phonetic Override ("What does it sound like?")
- Level Gating (L2 teach-back before L4)
- Source-Lock + RAG gate (mark unverified if no snippet)
- Drawing/visual stories when appropriate to concept (optional for anatomy)

---

## Commands (in-session; you can also speak naturally)
| Command | Action |
|---------|--------|
| `plan` | Start/review planning phase |
| `ready` | Move to next step |
| `bucket` | Group/organize items |
| `mode [core/sprint/drill]` | Switch operating mode |
| `sprint` | Shortcut to Diagnostic Sprint |
| `core` | Shortcut to Core mode |
| `drill` | Shortcut to Drill mode |
| `draw` | Request drawing instructions |
| `landmark` | Run landmark pass (anatomy) |
| `rollback` | Return to earlier phase/landmarks |
| `wrap` | End session and start WRAP |
| `skip` | Next item |
| `menu` | Show commands |

---

## Brain Integration (logs/resume)
- Use `brain/session_logs/TEMPLATE.md` to log; ingest with `python brain/ingest_session.py session_logs/YYYY-MM-DD_topic.md`.
- Generate resume: `python brain/generate_resume.py` before a session if you want context.

---

## Version History (short)
- 9.1 (Dec 2025): Added M0 Planning, Anatomy Engine, Source-Lock, drawing protocol.
- 9.0 (Dec 2025): Restructure modules, methods, drawing protocol.
- 8.6 (Nov 2025): Active Architect (Gated Platter, Phonetic Override, Modes).

