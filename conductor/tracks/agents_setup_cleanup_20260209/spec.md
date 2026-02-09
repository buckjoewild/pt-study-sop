# Specification for Track: Agent setup + instruction hygiene

## Objective
Make agent guidance consistent across tools (Claude Code, Codex) by tightening the canonical instruction flow, adding an explicit Agents Conductor track, and ensuring project-local skills are available where needed.

## Rationale
Instructions exist in multiple layers (global, repo, compatibility copies). If a tool only loads the compatibility layer, critical workflow rules and references can be missed. This track makes the "source of truth" unambiguous and reduces setup friction.

## Scope

### In-Scope
- Add an Agents setup track under `conductor/tracks/` and link it from `conductor/tracks.md`.
- Ensure repo-level `AGENTS.md` includes the standard workflow block.
- Ensure Claude compatibility files (`.claude/AGENTS.md`, `.claude/CLAUDE.md`) include critical workflow + links to canonical docs/tracks.
- Make the `x-research` skill available to Codex in this repo (`.codex/skills/x-research/`).

### Out-of-Scope
- Deleting or rewriting existing global agent configuration under `%USERPROFILE%`.
- Changing any production runtime behavior of the dashboard/brain.

## Deliverables
- New track folder: `conductor/tracks/agents_setup_cleanup_20260209/` with `spec.md`, `plan.md`, `metadata.json`.
- Updated instruction files: `AGENTS.md`, `.claude/AGENTS.md`, `.claude/CLAUDE.md`, and `CLAUDE.md` (as needed).
- Added Codex skill: `.codex/skills/x-research/`.

## Success Criteria
- Claude Code and Codex can both locate the canonical workflow and the current Agents track with no ambiguity.
- Repo-local `x-research` skill is discoverable by Codex.
- `git status` is cleaner for common planning artifacts.

