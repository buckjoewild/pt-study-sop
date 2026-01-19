# Obsidian Write Semantics (Brain → Obsidian)

## Default Behavior (Safe)
- Append a `## WRAP Highlights` block to a session note.
- Never rewrite user-authored content.
- Each block is keyed by `session_id` for idempotency.

## Managed Sections (Optional)
Brain may update only within managed blocks:
```
<!-- BRAIN_MANAGED_START -->
...
<!-- BRAIN_MANAGED_END -->
```
Outside these markers, Brain never edits.

## Duplicate Handling
- If a block for `session_id` exists, Brain skips writing.
- If user edits inside a managed block, Brain overwrites only that block.

## Note Targets (Configurable)
- Daily log note
- Course log note
- Topic note
- Hybrid (daily append + optional topic merge)
