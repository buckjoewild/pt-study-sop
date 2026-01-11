Goal (incl. success criteria):
- Run Scholar Orchestrator unattended: audit recent session logs, optionally research, synthesize one artifact, and update run log.
- Success: Outputs created only under scholar/outputs per runbook and run log includes required sections.

Constraints/Assumptions:
- Follow AGENTS.md; update this Continuity Ledger each turn and on state changes.
- UNATTENDED: no interactive questions; write questions to scholar/outputs/orchestrator_runs/questions_needed_<run>.md.
- READ-ONLY for sop/, brain/, dist/ (do not modify).
- Use defaults: module group M0-M6 + bridges; no Promotion Queue unless safe_mode true in audit_manifest.json.
- End run log with sections: What I Learned This Run, Action Items, Warnings.

Key decisions:
- Used strict 7-day audit window (no fallback) due to no recent logs.
- Produced gap analysis artifact and updated weekly digest.

State:
  - Done:
    - Verified audit_manifest.json (safe_mode false).
    - Audited session log window: no logs in last 7 days.
    - Created gap analysis artifact for missing recent logs.
    - Updated run log and weekly digest for 2026-01-10.
    - Added Enter key support to send Tutor messages (Shift+Enter still allows newlines).
    - Fixed tutor_turns table: added missing user_id column to schema + migration.
    - Converted Tutor UI from Q&A format to interactive chat window.
    - Added Saved Digests section to Scholar tab.
    - Repo RAG integration complete: index_repo_to_rag() indexes sop/, brain/, docs/ into rag_docs with corpus='repo'.
    - Scholar AI answer generation uses search_rag_docs(corpus='repo') for relevant context.
    - Simplified Scholar question interface: removed Chat/Generate buttons, now single Ask button with unified chat.
    - **Fixed Tutor RAG integration**: Tutor now searches across all corpuses (study, repo, runtime) instead of only 'study'.
    - Improved keyword tokenization: Tutor extracts significant keywords for better RAG matching.
    - **Per-question answer submission**: Scholar questions UI now has individual "Submit" buttons per question.
    - **Tutor AI response time optimizations**: Reduced RAG docs (5→4), context (50k→8k chars), snippets (2000→400 chars), timeout (60→30s), max_tokens (2000→600).
    - **Fixed Scholar answer submit bug**: `/api/scholar/questions/answer` now counts only unanswered questions to match frontend indexing.
  - Now:
    - Verified answered questions feature implementation is complete:
      - Backend: scholar.py parses Q:/A: format, returns answered_questions array
      - Backend: routes.py answer endpoint converts list format → Q:/A: format
      - Frontend: submitSingleAnswer() animates card out, calls loadScholar() after 1s
      - Frontend: toggleAnsweredQuestions() section exists in HTML/JS
    - Strategic Digest confirmed using OpenRouter (not Codex)
  - Next:
    - User to test live: submit an answer and verify it disappears + appears in Answered section

Open questions (UNCONFIRMED if needed):
- None.

Working set (files/ids/commands):
- brain/dashboard/routes.py (Scholar endpoints, new /api/rag/index-repo)
- brain/templates/dashboard.html (Scholar tab UI, Database tab)
- brain/static/js/dashboard.js (Scholar functions)
- brain/rag_notes.py (RAG implementation, new index_repo_to_rag function)
- brain/dashboard/scholar.py (generate_ai_answer with RAG context)
