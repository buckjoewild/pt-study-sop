# PT Study SOP - Master Plan (Stable North Star)
**Owner:** Trey Tucker  
**Purpose:** Version-agnostic blueprint so every release marches toward the same end-state. This file changes rarely (only when invariants or contracts change).

---

## 1) Vision (non-negotiable)
Build a personal AI study operating system that:
- Remembers across sessions (durable context, no drift).
- Runs end-to-end study flows (plan -> learn -> test -> log -> review) with minimal manual steps.
- Grounds all generation in the learner's own materials (RAG-first).
- Produces spaced, high-quality cards and retains outcomes over years.

---

## Program Goal (draft; lock for Spring 2026)
Build an interactive, RAG-first study guide that can teach any topic with explicit pedagogy, logs every session, learns the user's best modes per class, and steadily improves over the life of the project. Near-term targets: usable for finals in December 2025; smooth and reliable by next semester; multi-user ready later (kids/classmates). Calendar sync is explicitly the last priority - defer implementation until the current semester ends.

Working objectives (revise as evidence arrives)
- By finals (Dec 2025): zero missing session logs; each session records what worked/what didn't and updates preferences; draft cards resumed for at least 30% of sessions.
- By next semester start: end-to-end loop stable (plan -> learn -> log -> card draft), drift/off-source notes <5% of sessions, readiness/test-score trend reported weekly.
- Calendar integration: design only; build after semester ends.

---

## 2) Invariants (do not change across versions)
- **MAP -> LOOP -> WRAP** is the lifecycle.
- **Seed-Lock / Gated Platter / Teach-back**: user must supply seeds; system gates progression.
- **RAG-first generation**: cards and answers must come from indexed user materials, not free recall.
- **Single source of truth for context**: Brain DB + session logs + resume feed every session start.
- **Versioned schemas**: session_log, resume, card, and RAG doc schemas are explicit and backward-compatible.
- **Deterministic logging**: every session emits a log that conforms to the current schema; ingestion is required to "close" a session.
- **Observability**: every tool run and important decision is recorded (log/resume/dashboard).
- **Security/Privacy**: local-first storage; external APIs are opt-in per tool.

---

## 3) System architecture (stable components and contracts)
1. **Desktop/Orchestration Agent**  
   Contract: accepts natural-language tasks; can call tools with audit trail.
2. **Content Pipeline** (blackboard/files -> organize -> transcode -> transcribe -> index)  
   Contract: emits normalized documents with metadata (course, module, date, type, source path, checksum).
3. **RAG Index & Search**  
   Contract: ingest API for docs; search API returns citations + snippets; supports text + image/caption fields.
4. **Study Engine (SOP Runner)**  
   Contract: enforces MAP->LOOP->WRAP, Seed-Lock, gating; consumes RAG; produces structured session_log.
5. **Card/Anki Bridge**  
   Contract: add/update cards from structured payload; dedupe by deck+guid; log status.
6. **Brain (DB + Resume)**  
   Contract: ingest session_log to DB; generate resume + readiness; export JSON/MD; schemas are versioned.
7. **Multi-AI Router**  
   Contract: route tasks by type; must return tool+model used for audit.
8. **Dashboard**  
   Contract: read-only over Brain/RAG; visualizes coverage, spacing, calibration, anchors, cards.

---

## 4) Schemas (contracts that versions must honor)
- **Session Log v9.x** (already in use): date, time, duration, study_mode, target_exam/block, sources, plan, main_topic, subtopics, frameworks, gates, WRAP, anki_count, anatomy fields (region/landmarks/muscles/OIAN), ratings, anchors, reflection, next_session.  
  Rule: future versions may add fields; existing fields cannot be removed or repurposed without Master Plan change.
- **RAG Doc Schema v1**: {id, source_path, course, module, doc_type, created_at, checksum, text_chunks[], image_captions[], metadata{}}.
- **Card Schema v1**: {deck, guid, front, back, tags[], source_refs[], created_at, updated_at}.
- **Resume Output v1**: {generated_at, readiness_score, recent_sessions[], topic_coverage[], gaps[], recommendations[]}.

---

## 5) Roadmap ladder (stable phases)
Versions climb these rungs; they do not redraw them.
1. Blackboard/File downloads: reliable fetch + organize by course/module.
2. Transcode/Transcribe + Index: MP4 -> MP3/SRT/TXT; PDF OCR/captions; ingest to RAG.
3. RAG-backed Study Engine: SOP uses RAG for answers/cards; zero free-hallucination.
4. Card Bridge hardening: dedupe, queues, offline fallback, per-source tagging.
5. Dashboard & spacing: coverage maps, readiness, spacing alerts, calibration charts.
6. Multi-AI router: task-aware routing with fallbacks and audit.
7. Automation & scheduling: daily sync (downloads+ingest+resume), spaced notifications.

---

## 6) Governance & change control
- Any change to Vision, Invariants, Architecture, or Schemas requires an explicit edit to this file (rare).
- Version plans (e.g., v9.2 plan) can change scope/implementation but must not violate Invariants or Schemas.
- New fields must be additive and documented; migrations must be provided for Brain DB if schemas change.
- PR/change checklist: Does this break an invariant or a contract? If yes, update Master Plan or reject.

---

## 7) Operational minimums (for every version)
- Session template present and enforced in SOP UI/flows.
- Ingestion + resume generation must work (no broken pipeline).
- RAG reachable; if offline, cards must mark source as "unverified/offline".
- Sync script (downloads+ingest+resume) available and runnable in one command.
- Health checks: verify Blackboard fetch, RAG search, Anki connect, DB integrity.

---

## 8) Current alignment (as of v9.1 baseline)
- Session logging, ingestion, resume: working (v9.1).
- Card/Anki bridge: working; needs RAG gating.
- Dashboard: basic; needs heatmaps/spacing.
- Content pipeline: downloads/transcode/transcribe not yet automated.
- RAG: design decided; implementation pending.

---

## 9) Next target (without changing the North Star)
- Finish downloads + transcode/transcribe + RAG ingest (rungs 1-2).
- Wire SOP to use RAG for answers/cards (rung 3).
- Harden card dedupe/queue/tagging with source refs (rung 4).
- Add spacing/coverage visuals to dashboard (rung 5).

---

## 10) Update log (for this Master Plan)
- 2025-12-06: Initial stable Master Plan created for PT Study SOP (applies to all future versions).
