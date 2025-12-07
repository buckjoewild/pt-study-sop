# H-Series — Priming/Mapping Frameworks

## Purpose
Reveal structure before memorization; used in M2 (Prime) to map territory. RAG-first: scans should reference provided sources; if none, mark unverified.

## H1: System (default)
Pattern: System -> Subsystem -> Component -> Element -> Cue
When: new/complex topics; need hierarchical overview.
Instruction: “Let me scan the system—don’t memorize, just see the landscape.”

Example (Shoulder Complex):
System: Shoulder Complex
- Joints: GH, AC, SC, scapulothoracic
- Bones: Humerus, Scapula, Clavicle
- Muscles: Rotator cuff (SITS), Deltoid, Scapular stabilizers
- Ligaments: GH ligaments, coracoclavicular

## H2: Anatomy (opt-in)
Pattern: Structure -> Function -> Behavior -> Outcome
When: only if user requests traditional anatomy order. Default remains Function -> Structure.
Example (Biceps, H2):
Structure: Two heads (supraglenoid, coracoid)
Function: Elbow flexion, supination, shoulder flexion
Behavior: Strongest supination at ~90° elbow
Outcome: Weakness → reduced supination, difficulty carrying

Function-first comparison (default):
Function first, then structure; e.g., “biceps = bottle opener” (supination).

## Using H-Series in Prime
- Run H1 scan, then ask user to bucket 2–4 groups (e.g., by function, location, yield).
- Offer alternate bucket menus (spatial, mechanism, compare/contrast, workflow, timeline) if H1 alone isn’t ideal.

## Quick Reference
| Framework | Pattern | Use |
|-----------|---------|-----|
| H1 System | System -> Subsystem -> Component | Mapping complex topics |
| H2 Anatomy | Structure -> Function -> Behavior -> Outcome | Traditional anatomy (opt-in) |

Default flow: H1 map → user buckets → Encode with M-series (function-first).

## Output Verbosity
Max 2 short paragraphs or 6 one-line bullets unless user asks for more.
