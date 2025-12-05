# PT Study SOP

A structured study system for Doctor of Physical Therapy coursework, powered by the PERRIO protocol.

## Current Version: 9.1 "Structured Architect + Anatomy Engine"

---

## Quick Start

**Everything you need is in:** `releases/v9.1/`

1. Open `releases/v9.1/README.md` for setup instructions
2. Copy `GPT-INSTRUCTIONS.md` into your CustomGPT
3. Upload all files from `gpt-knowledge/` to GPT Knowledge
4. Run `python brain/db_setup.py` to initialize tracking
5. Start studying

---

## Repository Structure

```
pt-study-sop/
├── releases/
│   └── v9.1/                    ← CURRENT RELEASE (start here)
│       ├── README.md            ← Setup instructions
│       ├── GPT-INSTRUCTIONS.md  ← Copy to GPT Instructions field
│       ├── gpt-knowledge/       ← Upload to GPT Knowledge (14 files)
│       └── brain/               ← Session tracking system
├── sop/                         ← Source files (development)
│   ├── MASTER.md
│   ├── gpt-instructions.md      ← Full version (reference)
│   ├── gpt-instructions-short.md← Condensed for 8k limit
│   ├── runtime-prompt.md
│   ├── modules/
│   ├── frameworks/
│   ├── methods/
│   └── examples/
├── brain/                       ← Source brain system
├── archive/                     ← Previous versions
├── GAP_ANALYSIS.md              ← Known gaps and roadmap
├── NEXT_STEPS.md                ← Implementation checklist
├── RESEARCH_TOPICS.md           ← Learning science research guide
└── CHANGELOG.md                 ← Version history
```

---

## Core Concepts

| Concept | What It Means |
|---------|---------------|
| **Seed-Lock** | You must provide your own hook/metaphor before moving on |
| **Function Before Structure** | Learn what it DOES before where it IS |
| **Level Gating** | Prove understanding at L2 (teach-back) before advancing |
| **Gated Platter** | If stuck, GPT offers raw metaphor you must personalize |
| **Planning First** | No teaching until target + sources + plan established |
| **Anatomy Order** | Bones → Landmarks → Attachments → OIAN → Clinical |

---

## Study Modes

| Mode | When to Use |
|------|-------------|
| **Core** | New material, guided learning |
| **Sprint** | Test-first, rapid recall practice |
| **Drill** | Deep practice on specific weakness |

---

## What's New in v9.1

- **Planning Phase (M0):** Mandatory target/sources/plan before teaching
- **Anatomy Engine:** Bone-first protocol with visual landmark recognition
- **Rollback Rule:** Return to landmarks if OIAN struggles
- **Drawing Protocol:** AI-generated drawing instructions for anatomy
- **Condensed GPT Instructions:** Under 8k character limit
- **Packaged Release:** All files in `releases/v9.1/`

---

## Documentation

| Document | Purpose |
|----------|---------|
| `releases/v9.1/README.md` | Setup and usage guide |
| `sop/MASTER.md` | Complete system reference |
| `CHANGELOG.md` | Version history |
| `GAP_ANALYSIS.md` | Known gaps and future work |
| `RESEARCH_TOPICS.md` | Learning science research topics |

---

## Links

- **GitHub:** https://github.com/Treytucker05/pt-study-sop
- **Current Release:** `releases/v9.1/`
