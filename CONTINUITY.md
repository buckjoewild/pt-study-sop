Goal (incl. success criteria):
- Reconstruct a page-by-page spec for the PT Study Brain dashboard so Replit can rebuild Dashboard, Brain, Calendar, Tutor, and Scholar pages with the needed UI/API hooks; success = concise per-page feature list with canonical refs.
- (Paused) Fix PT Study Brain dashboard styling to match arcade theme from `C:/Users/treyt/OneDrive/Desktop/Arcade-RetroDesign`.
Constraints/Assumptions:
- Repo was restored from an older snapshot; some React source/support files may be missing (UNCONFIRMED until verified).
- Canonical behavior reference is `docs/dashboard_audit.md`.
- Prefer minimal viable workflow: log sessions → ingest → resume → calendar/events/tasks; Tutor/Scholar can be partial.
Key decisions:
- Synthesize the canonical audit (`docs/dashboard_audit.md` sections) with the current React pages (`brain/static/react/src/pages/*.tsx`) and API routes (`brain/dashboard/routes.py`, `brain/dashboard/api_adapter.py`) to list what each tab must render + the endpoints/payloads it consumes.
State:
  - Done:
    - Collated per-page feature lists for Dashboard, Brain, Calendar, Tutor, and Scholar along with the required data sources/endpoints.
    - Confirmed shared schema expectations via `brain/static/react/shared/schema.ts`.
  - Now:
    - Deliver this spec and await your next instruction (e.g., styling or deeper implementation).
  - Next:
    - Resume the paused arcade-styling task when requested.
Open questions (UNCONFIRMED if needed):
- Is Replit hosting the Flask backend, or will it only render the frontend and call your local server?
Working set (files/ids/commands):
- `docs/dashboard_audit.md`
- `brain/static/react/src/pages/dashboard.tsx`
- `brain/static/react/src/pages/brain.tsx`
- `brain/static/react/src/pages/calendar.tsx`
- `brain/static/react/src/pages/tutor.tsx`
- `brain/static/react/src/pages/scholar.tsx`
- `brain/dashboard/routes.py`
- `brain/dashboard/api_adapter.py`
- `brain/static/react/shared/schema.ts`
