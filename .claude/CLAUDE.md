# PT Study System (Claude Code)

This file exists for Claude Code tool compatibility.

Canonical project context: `C:\pt-study-sop\CLAUDE.md`  
Canonical agent rules: `C:\pt-study-sop\AGENTS.md`  
Global instructions: `C:\Users\treyt\.claude\CLAUDE.md`

If you are working on agent setup / skill wiring, use the Conductor Agents track:
- `conductor/tracks.md`
- `conductor/tracks/agents_setup_cleanup_20260209/`

# Workflow
- For any multi-step work: create and maintain the Task list; complete tasks one-by-one.
- Delegate:
  - Exploration/searching to a read-only subagent when possible
  - Test running to a test-runner subagent
  - Final review to code-reviewer subagent
- Prefer background subagents for long-running tasks; summarize results back in the main thread.
