# Draft: Brain Page Fixes (3 Issues)

## Requirements (confirmed)
1. **Assignments → Google Tasks**: Assignments not linked to Google Tasks. Currently only one-way import (Google Tasks → local). Need to push local assignments to Google Tasks.
2. **Dropdown backgrounds**: All dropdowns on Brain page have clear/transparent background making text hard to read. Need black/dark background.
3. **Syllabus View → Modules**: Rename tab to "MODULES". Show learning objectives organized under each module, grouped by week (Week 1, Week 2, etc.)

## Technical Decisions
- Issue 1: Google Tasks has create/patch/delete helpers already in gcal.py (lines 1220-1260) but they're unused. Need to wire assignments → Google Tasks push.
- Issue 2: Dropdown background controlled by `--popover` CSS variable in index.css (currently `0 0% 8%` = #141414). The `<SelectContent>` uses `bg-popover`. May need to set it darker or override on the Brain page specifically.
- Issue 3: SyllabusViewTab.tsx already groups modules by orderIndex (week) and shows LOs. Just needs tab rename + possible display refinement.

## Research Findings
- Google Tasks: gcal.py has `create_google_task()`, `patch_google_task()`, `delete_google_task()` at lines 1220-1260 but NOT wired to any sync flow
- Dropdowns: SelectContent in select.tsx uses `bg-popover text-popover-foreground` (line 70-100)
- Modules tab: Tab label "SYLLABUS VIEW" at brain.tsx lines 493-495, component at SyllabusViewTab.tsx

## Scope Boundaries
- INCLUDE: Fix all 3 issues
- EXCLUDE: Full bidirectional task sync, conflict resolution, task completion sync back to Google
