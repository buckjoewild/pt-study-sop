# PT Study SOP v8.6 (Active Architect)

This folder holds the Study SOP. Use `current/` for the live version, `archive/` for history, and `pt_study_brain/` for logging and analytics.

## One-screen navigation
- Current SOP: `current/v8.6/`
  - Core files: `Custom_GPT_Instructions.md`, `Runtime_Prompt.md`, `Master_Index.md`
  - Modules: `modules/Module_1_Core_Protocol.md`, `Module_2_Modes.md`, `Module_4_Recap_Engine.md`, `Module_5_Example_Flows.md`, `Module_6_Framework_Library.md`
- Roadmap & topics: `current/v8.6/roadmap.md` -> links to `current/v8.6/topics/`
  - Topic template: `current/v8.6/topics/Topic_Template.md`
- Logging template (Brain ingest): `Session_Log_Template.md` (root of this folder)
- Dashboard/Brain app: `pt_study_brain/` (Flask + SQLite + uploader)
- Version matrix: `VERSION_REFERENCE.md` (maps 8.x/7.x guardrails and file paths)
- Master plan: `PT_Study_SOP_Master_Plan.md` (strategy/status; Module 3 merged)
- Archive: `archive/legacy/` (older 8.x/7.x packages)

## Quick start (v8.6)
1) Load `current/v8.6/Custom_GPT_Instructions.md` into your GPT instructions.
2) Start sessions with `current/v8.6/Runtime_Prompt.md`.
3) Use modules 1/2/4/5/6 as needed; keep Level 2 teach-back before Level 4.
4) Log each session: copy `Session_Log_Template.md` -> `pt_study_brain/session_logs/YYYY-MM-DD_<topic>.md` -> ingest with `python pt_study_brain/ingest_session.py <file>`.
5) Review stats: `python Run_PT_Study_Brain_AllInOne.py` then open http://127.0.0.1:5000 (or run `dashboard.py` / `generate_resume.py`).

## Brain quick commands
- Launch dashboard: `python Run_PT_Study_Brain_AllInOne.py`
- New session stub: `python pt_study_brain/new_session.py <topic>`
- Ingest log: `python pt_study_brain/ingest_session.py pt_study_brain/session_logs/<file>.md`
- Generate resume: `python pt_study_brain/generate_resume.py`
- View analytics (CLI): `python pt_study_brain/dashboard.py`

## Notes
- `Session_Log_Template.md` is a Brain ingestion helper; it is not part of the SOP content.
- Module 3 is merged into Modules 1/2 and WRAP in v8.6 (no standalone Module 3 file).
