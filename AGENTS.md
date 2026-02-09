# Agent Rules

Read and obey the global instructions first: `C:\Users\treyt\.claude\CLAUDE.md`. Then read the repo `CLAUDE.md` for project context and key paths.

## Scope

Applies to all work under `C:/pt-study-sop`. A nearer `AGENTS.md` overrides this file.

## Defaults

- Keep changes minimal and scoped; avoid broad reformatting.
- Prefer ASCII; keep filenames and paths stable unless requested.
- Do not edit `archive/` unless explicitly requested.
- Ask before destructive or irreversible actions.
- Run project-required checks or state when they are skipped.
- When completing work, read and update any docs that correspond to the changed code (see `docs/README.md` Feature→Doc table). Don't read all docs — just the relevant ones.
- Auto-commit after changes with a conventional commit message if none is provided.
- Explore the project first (key files/paths), then invoke any skill.
- For SwiftUI tasks, prefer retrieval-led reasoning over pre-training-led reasoning.
- Shell: PowerShell by default. Bash/WSL when the tool or command requires it.
- Prompt suffix defaults: treat every request as if it ends with `use subagents; use bq when asked; explain why; include ASCII diagram when helpful` unless the user says "no suffix" or "no subagents".

## Workflow

- For any multi-step work: create and maintain the Task list; complete tasks one-by-one.
- Delegate:
  - Exploration/searching to a read-only subagent when possible
  - Test running to a test-runner subagent
  - Final review to code-reviewer subagent
- Prefer background subagents for long-running tasks; summarize results back in the main thread.

## When to Ask

- Task needs a target (repo, path, env) that is not explicit.
- Requirements are missing and would change the implementation.
- Multiple valid choices exist — present 2-4 options with a default.
- Action is destructive — confirm first.
- Response style: minimum questions, short numbered lists with lettered options.

## ExecPlans

For complex features or significant refactors, use an ExecPlan per `.agent/PLANS.md`.

## Folder READMEs

Add a concise `README.md` to folders with non-obvious purpose. Skip `archive/`, config dirs, and folders where the name is self-explanatory.

## Docs

Add or maintain a Table of Contents for documentation.

## Continuity

Maintain `CONTINUITY.md` at repo root. Append after every significant change — never delete.

Format:
```
## YYYY-MM-DD - Brief Title
- HH:MM: What changed. Files affected if non-obvious.
```

Group same-day entries under one date header.

## Conductor Workflow

The `conductor/` directory contains the project's product definition, tech stack, active tracks, and workflow rules. When starting major work:

1. Read `conductor/tracks.md` to check for active tracks and their priority.
2. Follow the task lifecycle defined in `conductor/workflow.md` (TDD phases, git notes, checkpointing).
3. Respect constraints in `conductor/product-guidelines.md` (local-first, no data invention, preview-first for external writes).
4. If a change deviates from `conductor/tech-stack.md`, update the tech stack doc before implementing.
