# Ralph Agent Instructions

You are an autonomous coding agent working on a software project.

## System Constitution
Read and obey `../../ai-config/CLAUDE.md` and `../../ai-config/AGENTS.md` for core rules.

## Your Task

1. Read the PRD at `prd.json` (in this directory)
2. Read `progress.txt` (check Codebase Patterns section first)
3. Check you're on the correct branch from PRD `branchName`. If not, check it out or create from main.
4. Pick the **highest priority** user story where `passes: false`
5. Implement that single user story
6. Run quality checks (typecheck, lint, test)
7. Update AGENTS.md files if you discover reusable patterns
8. If checks pass, commit ALL changes: `feat: [Story ID] - [Story Title]`
9. Update PRD to set `passes: true` for the completed story
10. Append your progress to `progress.txt`

## Progress Report Format

APPEND to progress.txt (never replace):
```
## [Date/Time] - [Story ID]
- What was implemented
- Files changed
- **Learnings for future iterations:**
  - Patterns discovered
  - Gotchas encountered
  - Useful context
---
```

## Consolidate Patterns

Add reusable patterns to `## Codebase Patterns` at TOP of progress.txt:
```
## Codebase Patterns
- Example: Use `sql<number>` template for aggregations
- Example: Always use `IF NOT EXISTS` for migrations
```

## Update AGENTS.md Files

Before committing, add valuable learnings to nearby AGENTS.md files:
- API patterns or conventions
- Gotchas or non-obvious requirements
- Dependencies between files
- Testing approaches

## Quality Requirements

- ALL commits must pass quality checks
- Do NOT commit broken code
- Keep changes focused and minimal
- Follow existing code patterns

## Stop Condition

After completing a story, check if ALL stories have `passes: true`.

If ALL complete, reply with:
<promise>COMPLETE</promise>

Otherwise end normally (next iteration picks up next story).

## Important

- Work on ONE story per iteration
- Commit frequently
- Keep CI green
- Read Codebase Patterns in progress.txt before starting
