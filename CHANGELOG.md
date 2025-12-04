# Changelog

## [9.1] - 2025-12-04 — "Structured Architect + Anatomy Engine"

### Added
- **M0: Planning Phase** — Front-loaded planning before any teaching
  - Target identification (exam/block)
  - Position clarification (covered vs remaining)
  - Materials gathering (LOs, slides, labs)
  - Source-Lock (explicit materials for THIS session)
  - Plan of Attack (3-5 steps)
- **Anatomy Learning Engine** (`modules/anatomy-engine.md`)
  - Mandatory learning order: Bones → Landmarks → Attachments → OIAN → Clinical
  - Bone-First Attachment Loop protocol
  - Visual-First Landmark Protocol
  - Rollback Rule (return to landmarks if OIAN struggles)
  - Metaphor restriction (visual-first is mandatory)
- New commands: `plan`, `landmark`, `rollback`
- Primary Goal for Anatomy as top-level principle

### Changed
- Session flow now starts with M0 (Planning) before M1 (Entry)
- gpt-instructions.md updated with Anatomy Engine rules
- runtime-prompt.md updated with planning phase and anatomy protocol
- Version bumped to 9.1

### Constraints Added
- ❌ NOT ALLOWED: Jumping to OIAN before landmark mapping complete
- ❌ NOT ALLOWED: Clinical patterns before OIAN stable
- ❌ NOT ALLOWED: Muscle-first approaches (unless quick review)

---

## [9.0] - 2025-12-04 — "Structured Architect"

### Added
- Methods library (`sop/methods/`) with learning science foundations
  - Desirable difficulties
  - Metacognition
  - Elaborative interrogation
  - Retrieval practice
  - Drawing for anatomy
- Drawing protocol for anatomy visualization
- Structured drawing instruction format (BASE → STEPS → LABEL → FUNCTION)
- Enhanced Brain analytics for readiness tracking
- Session template with calibration ratings
- Commands reference document

### Changed
- **Module renumbering:** Eliminated gap (M1, M2, M3, M4, M5, M6 now sequential)
  - Old M4 (Recap Engine) → New M6 (Wrap)
  - Old M5 (Example Flows) → Moved to examples/
  - Old M6 (Framework Library) → Split into frameworks/
- Restructured folder organization
  - `sop/` contains all system files
  - `brain/` replaces `pt_study_brain/`
  - Clear separation of modules, frameworks, methods, examples
- Single MASTER.md replaces Master_Plan.md and Master_Index.md
- Simplified gpt-instructions.md for CustomGPT usage
- Updated runtime-prompt.md for cleaner session starts

### Fixed
- Documentation drift between Master Plan and Master Index
- Unclear module 3 "merged" status
- Duplicate Brain folder confusion
- Session template location inconsistency

### Archived
- v8.6 backed up to `archive/v8.6_backup/`
- Previous versions remain in archive/

---

## [8.6] - 2025-11 — "Active Architect"

### Added
- Gated Platter mechanism
- Phonetic Override protocol
- Mode system (Core/Sprint/Drill)
- Brain Storage System (SQLite)

### Changed
- Enhanced Seed-Lock enforcement
- Improved level gating

---

## [8.5.1] - Earlier — "Spotter Prime"

### Added
- Seed-Lock requirement
- User-generated hook enforcement

---

## [8.4] - Earlier — "Tutor Edition"

### Added
- Safety Override protocols
- Basic mode switching

---

## [7.x] - Earlier — Foundation

### Added
- Initial MAP/LOOP/WRAP framework
- Basic H-Series and M-Series frameworks
- Level progression system
