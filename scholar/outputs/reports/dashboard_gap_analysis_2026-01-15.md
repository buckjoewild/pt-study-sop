# Dashboard Gap Analysis & Test Readiness (2026-01-15)

## Objective
Identify unused/unconnected elements, confirm which flows are wired, and state test readiness per tab.

## Test readiness by tab

| Tab | Status | Notes | Evidence |
| --- | --- | --- | --- |
| Overview | Conditional | Depends on session data and Scholar insights; chart/insights render only if data exists. | `dashboard.html` (~122-464), `dashboard.js` (~720+) |
| Brain (sessions) | Ready | Core CRUD flows use `/api/sessions` and `/api/quick_session`; requires local DB. | `dashboard.js` (~424/1492), `routes.py` L1997/L1910 |
| Syllabus & Calendar | Partially blocked | Local syllabus CRUD works; Google Calendar/Tasks sync requires OAuth and credentials. | `dashboard.js` (~2272/6622), `routes.py` L2803/L3748 |
| Scholar | Blocked | Requires API key and Scholar runtime; run/status endpoints need external context. | `dashboard.js` (~2994/3534), `routes.py` L1218/L665 |
| Tutor | Blocked | Requires Tutor session backend and RAG inputs configured; depends on files and LLM. | `dashboard.js` (~2193/1630), `routes.py` L2284/L2446 |
| Brain Database | Ready | Mastery/cards/sync endpoints wired; depends on DB content. | `dashboard.js` (~5675/5796), `routes.py` L164/L3522 |
| Sync Inbox | Blocked | Scraper and sync endpoints require external config and pending data. | `dashboard.js` (~6638/6683), `routes.py` L3824/L213 |

## Gaps (unused or unconnected)

1) **Navigation reachability gap (Brain Database + Sync Inbox not in top nav)**
- Evidence: top nav uses `overview`, `syllabus`, `sessions`, `scholar`, `tutor` only. `tab-brain` and `tab-sync` exist but are only referenced in legacy nav markup.
- Impact: Brain Database and Sync Inbox are effectively hidden in current UI.
- Proposed fix: add top-nav buttons for Database and Sync, or provide a visible link in Overview/Brain.

2) **RAG indexing/search endpoints lack UI wiring**
- Endpoints: `/api/rag/index-repo`, `/api/rag/search` in `routes.py` (L2514/L2531)
- Evidence: no `/api/rag/*` fetch calls in `dashboard.js`.
- Proposed fix: add “Index Repo” + “RAG Search” controls in Tutor RAG panel or document as CLI-only.

3) **Google Tasks lists endpoint unused**
- Endpoint: `/api/gtasks/lists` (L3815)
- Evidence: no JS fetch for `/api/gtasks/lists`.
- Proposed fix: add UI selector for task list or remove endpoint if unused.

4) **Scholar helper endpoints not exposed**
- Endpoints: `/api/scholar/implementation-bundle`, `/api/scholar/execute-via-ai` (L641/L1764)
- Evidence: no JS wiring in Scholar tab.
- Proposed fix: add buttons in Scholar “System Health & Research” or “Ralph” panels to trigger these workflows, or mark as API-only.

5) **Tutor card-draft endpoint unused**
- Endpoint: `/api/tutor/card-draft` (L2776)
- Evidence: no JS references to `/api/tutor/card-draft`.
- Proposed fix: wire to Tutor answer UI (e.g., “Create Card Draft” button), or remove/merge with `/api/cards/draft`.

6) **Resume download endpoint unused**
- Endpoint: `/api/resume/download` (L1813)
- Evidence: Resume panel uses `/api/resume` only.
- Proposed fix: add “Download Resume” button to Resume panel or remove endpoint if not needed.

7) **Styleguide not routed**
- File: `brain/templates/styleguide.html`
- Evidence: no route in `routes.py`.
- Proposed fix: add a read-only `/styleguide` route or link to it from dev tools.

8) **Notes sidebar local-only**
- Component: notes sidebar uses localStorage, no backend persistence.
- Impact: notes are per-browser only; may be acceptable but not synced.
- Proposed fix: document as local-only, or add backend storage endpoint if needed.

## Proposed fixes (priority order)
1) Add top-nav access to `tab-brain` and `tab-sync` (restores reachability).
2) Decide on API-only vs UI-exposed for `/api/rag/*`, `/api/gtasks/lists`, `/api/scholar/implementation-bundle`, `/api/scholar/execute-via-ai`, `/api/tutor/card-draft`, `/api/resume/download`.
3) Document external dependencies required to test Scholar/Tutor/Sync/Google integrations.

## Evidence index (key files)
- `brain/templates/dashboard.html` (tabs, panels, nav)
- `brain/static/js/dashboard.js` (handlers, fetch calls)
- `brain/dashboard/routes.py` (endpoint handlers)
- `brain/templates/styleguide.html` (appendix)
