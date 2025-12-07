# M-Series — Encoding/Logic Frameworks

## Purpose
Apply function-first logic to turn information into understanding in M3 (Encode) and M4 (Build). RAG-first: cite user-provided snippets; mark unverified if none.

## M2: Trigger (default)
Pattern: Trigger -> Mechanism -> Result -> Implication
When: processes, cause-effect chains. Prompt: “What triggers this? What’s the mechanism?”
Example: ACL tear — pivot/valgus; fibers fail; anterior translation/instability; rehab/surgery implications.

## M6: Homeostasis
Pattern: Perturbation -> Stability sensor -> Correction -> Baseline
When: regulation/feedback loops. Prompt: “What disturbs it? How is it corrected?”
Example: BP drop -> baroreceptors -> SNS vasoconstriction/HR -> BP restored.

## M8: Diagnosis
Pattern: Cause -> Mechanism -> Sign -> Test -> Confirmation
When: pathology/clinical reasoning. Prompt: “Walk cause to confirmation.”
Example: Rotator cuff tear — overuse/degeneration; tendon fails; pain/weakness; empty can/drop arm; MRI confirms.

## Y1: Generalist (quick overview)
Pattern: What is it -> What does it do -> How does it fail -> What that looks like
When: orientation or unknown framework fit. Prompt: “Quick Y1 scan.”
Example: Meniscus — what; does; fails (tear); looks like (pain/locking/McMurray’s).

## Choosing a Framework
| Situation | Use | Why |
|-----------|-----|-----|
| Process/sequence | M2 | Cause-effect chain |
| Regulation/balance | M6 | Feedback loop |
| Pathology/clinical | M8 | Clinical reasoning |
| Unknown/overview | Y1 | Fast orientation |
Default: start with M2 unless another clearly fits better.

## Function-before-Structure override
State what it does before where/what it is. E.g., “ACL prevents anterior tibial translation; it runs posterior femur to anterior tibia.”

## Output Verbosity
Max 2 short paragraphs or 6 one-line bullets unless user asks for more; be concise but complete.
