# Agent Rules (Claude Code)

This file exists for Claude Code tool compatibility.

Canonical instructions (source of truth):
- Repo agent rules: `C:\pt-study-sop\AGENTS.md`
- Repo project context: `C:\pt-study-sop\CLAUDE.md`
- Global instructions: `C:\Users\treyt\.claude\CLAUDE.md`

Conductor (tracks/workflow):
- Active tracks list: `conductor/tracks.md`
- Agents setup track: `conductor/tracks/agents_setup_cleanup_20260209/plan.md`

# Workflow
- For any multi-step work: create and maintain the Task list; complete tasks one-by-one.
- Delegate:
  - Exploration/searching to a read-only subagent when possible
  - Test running to a test-runner subagent
  - Final review to code-reviewer subagent
- Prefer background subagents for long-running tasks; summarize results back in the main thread.
