# Research Index

## Purpose
This document tracks artifact-anchored research and refinement status so study SOP updates stay organized and evidence-based.

## Artifact Inventory
| File | Layer (Learning / Execution / Enforcement / Measurement) | Cognitive Job (one sentence, inferred from file name and docs) | Explicit or Implicit? (Explicit / Implicit / Missing) | Research Status (Not started / In progress / Complete) | Change Status (None / Candidate / Implemented) |
| --- | --- | --- | --- | --- | --- |
| sop/gpt-knowledge/PEIRRO.md | Learning | Defines the Prepare-Encode-Interrogate-Retrieve-Refine-Overlearn learning cycle. | Explicit | Complete | None |
| sop/gpt-knowledge/KWIK.md | Learning | Details the Sound + Function + Image + Resonance + Lock encoding flow (dual code with phonetic hooks). | Explicit | Complete | None |
| sop/modules/M0-planning.md | Execution | Outlines planning steps before sessions (target, materials, 1-3 item pretest). | Explicit | Complete | Implemented |
| sop/modules/M1-entry.md | Execution | Guides entry checks and readiness gating. | Explicit | In progress | Candidate |
| sop/modules/M2-prime.md | Execution | Provides priming steps to activate prior knowledge (prediction/pretest). | Explicit | Complete | Implemented |
| sop/modules/M3-encode.md | Execution | Directs encoding activities, dual coding, and self-explanation. | Explicit | Complete | None |
| sop/modules/M4-build.md | Execution | Describes practice design (interleaving, spacing, faded guidance). | Explicit | Complete | None |
| sop/modules/M5-modes.md | Execution | Specifies operating modes and selection rules. | Explicit | In progress | Candidate |
| sop/modules/M6-wrap.md | Execution | Covers wrap-up, reflection, cards, and next-review scheduling. | Explicit | Complete | Implemented |
| sop/engines/anatomy-engine.md | Enforcement | Enforces bone -> landmark -> attachment -> actions/innervation/arterial -> clinical sequence. | Explicit | Complete | None |
| sop/gpt-knowledge/gpt-instructions.md | Enforcement | Sets runtime rules for the Structured Architect identity and behavior. | Explicit | Complete | None |
| sop/gpt-knowledge/runtime-prompt.md | Enforcement | Provides the session startup prompt and gating questions. | Explicit | Complete | None |
| brain/* | Measurement | Aggregates session logs, dashboards, and sync scripts for tracking study activity. | Explicit | In progress | Candidate |

## Research Notes
### P - Prepare (Plan/Prime)
- Pretesting and prediction before study significantly improve later learning versus extra study time, supporting M0/M2 pre-questions and brain-dump gates. citeturn0search1turn0search2

### E - Encode (Dual code, self-explain)
- Dual coding (verbal + imagery) yields better retention than verbal-only instruction, aligning with KWIK's sound -> function -> image flow. citeturn2search2
- Self-explanation during learning produces medium-to-large gains across domains, matching M3 prompts to paraphrase and explain. citeturn1search9

### I - Interrogate (Desirable difficulties)
- Retrieval attempts during study—even when answers are initially unknown—drive stronger learning (testing effect), justifying interposed questions in M3/M4. citeturn0search5

### R - Retrieve
- Retrieval practice outperforms restudy for long-term retention in both recognition and recall formats, underpinning sprint/drill modes. citeturn0search5

### R - Refine (Feedback and correction)
- Corrective testing after delays (24h and 7d) with feedback beats massed restudy, supporting spaced error review in M4/M6. citeturn0search0turn0search3

### O - Overlearn (Spacing and interleaving)
- Spacing reviews over days markedly increases retention versus massed practice, backing the 1-3-7 day scheduling rule in runtime prompts. citeturn0search0turn0search3
- Interleaving categories improves inductive learning beyond spacing alone, supporting M4 mixed/varied practice guidance. citeturn1search4turn1search6

### Anatomy Engine (visual-first, spatial)
- Spatial ability strongly predicts anatomy performance, and anatomy training can raise spatial scores, supporting bone/landmark-first mapping before OIANA+. citeturn1search1turn1search7
- Students trained with 3D/labeled bones identify landmarks more accurately than 2D-only, reinforcing landmark-first passes and drawing prompts. citeturn1search5

## Refinement Rules
- Changes require an identified gap, supporting research, and an explicit decision before updating any artifact.
- Recording "no change" is acceptable when evidence supports the current state.

## Stopping Criteria
- An artifact is considered done for refinement when its intended layer and cognitive job are validated, open research questions are closed or deferred with rationale, and no pending change candidates remain.


