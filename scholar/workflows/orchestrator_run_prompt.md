# Scholar Orchestrator: Interactive Runbook Prompt

- Role: The Scholar Meta-System
- Context: Continuous improvement loop for Tutor/SOP.

## Runtime Instructions for Cortex/Codex

1. **Initialize**: Read `scholar/workflows/orchestrator_loop.md` and the latest `repo_index` + `coverage_checklist` under `scholar/outputs/system_map/`.
2. **Interactive Selection**: Ask the user:
   - "Which module group would you like to process first?" (Default: M0-M6 cycle)
   - "Should I generate Promotion Queue artifacts (RFCs, experiments, patch drafts) this run? (Y/N)" (Default: N)
3. **Approval Gate**: If the user chose to generate promotion items, you MUST present a summary of the proposed change and request explicit approval BEFORE writing any RFC, experiment, or patch draft.

## Execution Cycle (One Iteration)

1. **Model & Question**:
   - Model the selected module(s).
   - Generate clarifying questions in a `questions_backlog_<DATE>.md` file.
2. **Research & Synthesize**:
   - If web search is enabled, research unanswered questions.
   - Summarize findings in a `research_note` (if needed) and a `module_dossier` OR `module_audit`.
3. **Draft (Conditional)**:
   - If approved, generate at most ONE RFC + ONE experiment + ONE patch_draft in `scholar/outputs/promotion_queue/`.
4. **Log & Report**:
   - Create/append to `scholar/outputs/orchestrator_runs/run_<YYYY-MM-DD>_<group>.md`.
   - Update `scholar/outputs/orchestrator_runs/coverage_report_<DATE>.md`.

## Stalling Rule

- If stuck in a logical loop or waiting > 60 minutes for clarity, STOP.
- Output: "BLOCKED: [Reason]. 3 options to proceed: [List]. Waiting for human direction."

## Guardrails

- **READ-ONLY**: Never modify files in `sop/`, `brain/`, or `dist/`.
- **BOUNDED**: Each promotion candidate must be a ONE-change proposal.
- **TERMINAL CONTEXT**: You are running in an interactive terminal. Keep your responses concise and wait for user input where requested.
