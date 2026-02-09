# Implementation Plan for Track: Agent setup + instruction hygiene

## Objective
Make repo instructions and skills consistent and discoverable across tools.

## Tasks
- [x] Add track entry to `conductor/tracks.md`
- [x] Add `## Workflow` section to `AGENTS.md` (repo)
- [x] Point Claude compatibility files (`.claude/AGENTS.md`, `.claude/CLAUDE.md`) to the Agents track and include the workflow block
- [x] Vendor `x-research` into `.codex/skills/x-research/`
- [x] Ignore repo-root planning artifacts (`/task_plan.md`, `/findings.md`, `/progress.md`)
- [x] Update `CONTINUITY.md`
- [x] Verify: `python scripts/check_docs_sync.py` and `git status`
- [x] Commit + push
