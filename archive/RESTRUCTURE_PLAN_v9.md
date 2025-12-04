# PT Study SOP v9.0 Restructure Plan
**Created:** December 4, 2025
**Purpose:** Clean restructure with logical module flow, research-backed methods, and clear separation

---

## Current State Problems

1. **Module numbering gap** - Modules 1,2,4,5,6 with "merged" Module 3
2. **Documentation drift** - Master Plan and Master Index contradict each other
3. **Unclear file organization** - Multiple overlapping docs (README, Master Plan, Master Index)
4. **Brain location confusion** - Two pt_study_brain folders
5. **Missing session template** at documented location
6. **GitHub structure doesn't match local**

---

## Proposed v9.0 Structure

```
pt-study-sop/
├── README.md                    # Quick start only (< 50 lines)
├── CHANGELOG.md                 # Version history
│
├── sop/                         # The actual study system
│   ├── MASTER.md               # Single source of truth (replaces Master Plan + Master Index)
│   ├── gpt-instructions.md     # CustomGPT system prompt
│   ├── runtime-prompt.md       # Session start script
│   │
│   ├── modules/                 # Renumbered logically
│   │   ├── M1-entry.md         # Session entry (state check, scope, mode selection)
│   │   ├── M2-prime.md         # Priming/Mapping (H-Series, bucketing)
│   │   ├── M3-encode.md        # Encoding (M-Series, function-first, phonetic hooks)
│   │   ├── M4-build.md         # Building (Gated Platter, level progression, teach-back)
│   │   ├── M5-modes.md         # Operating modes (Core, Sprint, Drill)
│   │   └── M6-wrap.md          # Session close (recap, card selection, logging)
│   │
│   ├── frameworks/              # Reference library (separate from protocol)
│   │   ├── H-series.md         # Priming tools (H1-System, H2-Anatomy)
│   │   ├── M-series.md         # Encoding tools (M2-Trigger, M6-Homeostasis, etc.)
│   │   ├── Y-series.md         # Generalist tools
│   │   └── levels.md           # 4-10-HS-PT pedagogy levels
│   │
│   ├── methods/                 # Learning science reference (NEW)
│   │   ├── desirable-difficulties.md
│   │   ├── metacognition.md
│   │   ├── elaborative-interrogation.md
│   │   ├── retrieval-practice.md
│   │   └── drawing-for-anatomy.md
│   │
│   └── examples/                # Example flows and dialogues
│       ├── gated-platter.md
│       ├── diagnostic-sprint.md
│       ├── core-walkthrough.md
│       └── commands.md
│
├── brain/                       # Session tracking (renamed from pt_study_brain)
│   ├── README.md               # Brain-specific docs
│   ├── config.py
│   ├── db_setup.py
│   ├── ingest_session.py
│   ├── generate_resume.py
│   ├── dashboard.py
│   ├── data/
│   │   └── pt_study.db
│   ├── session_logs/
│   │   └── TEMPLATE.md         # Single canonical template
│   └── output/
│       └── session_resume.md
│
├── archive/                     # Old versions (keep for reference)
│   ├── v8.6/
│   ├── v8.5.1/
│   └── legacy/
│
└── .git/
```

---

## Module Logic Flow (v9.0)

The new numbering follows the actual session flow:

```
M1 (Entry) → M2 (Prime) → M3 (Encode) → M4 (Build) → M6 (Wrap)
                                ↑
                           M5 (Modes)
                        [Switches behavior]
```

### M1: Entry
- State check (focus 1-10, motivation)
- Scope confirmation (materials, topic)
- Mode selection (Core/Sprint/Drill)
- Prior session context loading

### M2: Prime (MAP Phase)
- System Scan with H-Series
- Bucketing ("don't memorize yet—just bucket")
- Identify structure before encoding

### M3: Encode
- Function-first framing (M-Series)
- Phonetic Override for new terms
- User supplies Seed (elaborative interrogation)

### M4: Build (LOOP Phase)
- Gated Platter mechanism
- Level progression (L1 → L2 → L3 → L4)
- Mandatory teach-back at L2 before L4
- Drawing integration for anatomy (NEW)

### M5: Modes (Behavior Modifier)
- **Core**: Full Prime → Encode → Build cycle
- **Sprint**: Fail-first rapid testing, teach only on miss
- **Drill**: Deep dive on weak buckets

### M6: Wrap
- Review locked anchors
- User selects items for cards
- Co-create Anki cards
- Log session to Brain

---

## New: Methods Library

This is a reference section documenting the "why" behind techniques:

### desirable-difficulties.md
- Spacing vs massing
- Interleaving vs blocking
- Generation effect
- How these apply to PT study

### metacognition.md
- Monitoring (calibration)
- Control (study decisions)
- Planning & evaluation
- Self-assessment prompts for sessions

### elaborative-interrogation.md
- Why Seed-Lock works
- How/why questions
- Connecting to prior knowledge
- When it fails (low prior knowledge)

### retrieval-practice.md
- Testing effect
- Why Diagnostic Sprint works
- Active recall vs recognition

### drawing-for-anatomy.md (NEW - You requested this)
- Simple shapes approach
- Step-by-step instructions format
- Function → Structure drawing
- Integration with encoding phase

---

## Drawing for Anatomy Module (Draft)

Based on research, here's how to integrate drawing:

### Core Principle
"Draw to understand, not to be artistic"

### Drawing Protocol
1. **Start with function**: What does this structure DO?
2. **Geometric base**: Circle, oval, rectangle, line
3. **Add landmarks**: Key attachment/origin points
4. **Label as you go**: Force retrieval while drawing
5. **Teach the drawing**: Explain it out loud

### Instruction Format for AI
When AI needs to guide drawing, use this format:

```
DRAW: [Structure Name]
Base Shape: [oval/rectangle/line/etc]
Step 1: Draw [shape] approximately [size reference]
Step 2: Add [feature] at [position - use clock positions or fractions]
Step 3: Connect [A] to [B] with [line type]
Label: [what to write and where]
```

### Example: Rotator Cuff (Simplified)
```
DRAW: Supraspinatus
Base Shape: Oval (scapula outline)
Step 1: Draw horizontal oval, slightly tilted (scapula body)
Step 2: Add small bump at 2 o'clock position (acromion)
Step 3: Draw line from top center of oval → bump (supraspinatus muscle)
Step 4: Extend line past bump to 3 o'clock (insertion on humerus)
Label: "S" at origin, "Greater Tubercle" at insertion
Function note: "Initiates abduction (first 15°)"
```

---

## Metadata & Growth System

You asked about gathering metadata to grow. Here's what to track:

### Session-Level Metrics (Brain captures these)
- Date, duration, topic
- Mode used (Core/Sprint/Drill)
- Frameworks applied (H1, M2, etc.)
- Gated Platter triggered (Y/N)
- WRAP reached (Y/N)
- Cards created count

### Self-Assessment Metrics (User provides)
- Understanding (1-5)
- Retention confidence (1-5)
- System performance (1-5)
- What worked (free text)
- What needs fixing (free text)

### Derived Analytics (Dashboard computes)
- **Topic heat map**: Which topics studied most/least
- **Mode distribution**: Are you over-relying on one mode?
- **Framework usage**: Which frameworks produce best retention?
- **Calibration accuracy**: Does your confidence match actual performance?
- **Session efficiency**: Time spent vs understanding gained
- **Gap detection**: Topics with low scores needing review

### Growth Questions (Weekly Review)
1. What patterns do I see in my weak areas?
2. Which frameworks help me most?
3. Am I spacing my practice or cramming?
4. Are my confidence ratings calibrated with actual performance?
5. What should I prioritize next week?

---

## Migration Steps

### Phase 1: Archive Current (Today)
- [ ] Create `archive/v8.6/` backup of current `current/v8.6/`
- [ ] Archive duplicate `archive/pt_study_brain/`
- [ ] Git commit: "Archive v8.6 before restructure"

### Phase 2: Create New Structure (Today)
- [ ] Create new folder structure per above
- [ ] Move and rename files
- [ ] Create single MASTER.md from Master Plan + Master Index
- [ ] Create methods/ library files

### Phase 3: Content Updates (This Week)
- [ ] Renumber modules and update cross-references
- [ ] Write drawing-for-anatomy.md
- [ ] Consolidate Brain docs
- [ ] Update README to < 50 lines

### Phase 4: Test & Validate
- [ ] Run 3 sessions with new structure
- [ ] Log to Brain
- [ ] Generate resume
- [ ] Identify friction points

---

## Questions Before Proceeding

1. **Methods library depth**: Do you want detailed research summaries or just practical "how to use" guides?

2. **Drawing module**: Should AI generate step-by-step instructions during sessions, or do you want a pre-built library of common PT structures?

3. **Brain dashboard**: What specific charts/visualizations would help you most?
   - Topic coverage heatmap?
   - Confidence vs performance calibration?
   - Time spent per mode?
   - Retention decay curves?

4. **CustomGPT focus**: Should the system prompt be optimized for:
   - Guided tutoring (AI leads)
   - Spotter mode (user leads, AI validates)
   - Hybrid (adaptive based on mode)?

---

## Next Steps

Once you answer the questions above, I will:

1. Execute the folder restructure
2. Write the new module files
3. Create the methods library
4. Build the drawing-for-anatomy protocol
5. Update the Brain to match new structure
6. Generate a clean README

Ready when you are.
