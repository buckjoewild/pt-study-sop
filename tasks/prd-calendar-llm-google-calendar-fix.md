# PRD: Calendar LLM Google Calendar Connection Fix

## Introduction
Fix the Calendar AI assistant so it connects to Google Calendar using the existing OAuth credentials/tokens in the repo. The assistant must have full CRUD permissions (add/edit/delete/find) across all calendars, and the calendar layout must display real Google events. The current "not connected" message in the AI assistant should only appear when auth is truly missing or expired.

## Goals
- Connect Calendar AI assistant to Google Calendar via existing OAuth tokens.
- Enable full CRUD access across all calendars the user can access.
- Populate the calendar layout with real Google events (all calendars).
- Provide clear connection status and actionable errors when auth is missing or expired.

## User Stories

### US-001: Initialize Google Calendar client from existing tokens
**Description:** As a developer, I need the backend to load existing OAuth credentials/tokens so Calendar API calls can succeed.

**Acceptance Criteria:**
- [ ] Locate and use the existing OAuth client credentials and token files already stored in the repo.
- [ ] Google Calendar client initializes successfully with stored tokens.
- [ ] If tokens are missing or expired, backend returns a clear error indicating re-auth is required.
- [ ] Typecheck/lint passes (if applicable).

### US-002: AI assistant CRUD across all calendars
**Description:** As a user, I want the AI assistant to add, edit, delete, and find events across all my calendars.

**Acceptance Criteria:**
- [ ] Find/search returns events across all calendars accessible by the token.
- [ ] Create/edit/delete succeed and include calendar id and event id in the response.
- [ ] If the calendar is not specified, default to primary calendar and note it in the response.
- [ ] API failures return an actionable error (e.g., permission denied, token expired).
- [ ] Typecheck/lint passes (if applicable).

### US-003: Calendar layout shows Google events
**Description:** As a user, I want the calendar page to display Google events so the layout reflects my real schedule.

**Acceptance Criteria:**
- [ ] Calendar UI fetches events from the backend (not mock data).
- [ ] Events display correct date/time and calendar source.
- [ ] After AI add/edit/delete, the UI refreshes to show changes (manual refresh or auto).
- [ ] Typecheck/lint passes.
- [ ] Verify in browser using dev-browser skill.

### US-004: AI assistant connection status
**Description:** As a user, I want the AI assistant to show a connected state when OAuth is valid and a clear next step when it is not.

**Acceptance Criteria:**
- [ ] AI assistant checks connection status on open.
- [ ] When connected, no "not connected" error is shown.
- [ ] When not connected, show a clear CTA (e.g., "Connect Google Calendar") that triggers the existing auth flow.
- [ ] Typecheck/lint passes.
- [ ] Verify in browser using dev-browser skill.

## Functional Requirements
- FR-1: Load existing OAuth client credentials and token files from the repo.
- FR-2: Initialize Google Calendar API client with read/write scopes (events CRUD).
- FR-3: Support listing calendars and querying events across all calendars.
- FR-4: Provide backend endpoints/tools for AI assistant CRUD operations.
- FR-5: Calendar UI pulls events from backend and renders them in the layout.
- FR-6: Expose a connection status check for the AI assistant.
- FR-7: Surface actionable errors when auth is missing/expired or API calls fail.

## Non-Goals (Out of Scope)
- Multi-user OAuth onboarding or new auth provider integrations.
- Calendar UI redesign or major layout changes.
- Advanced natural language scheduling improvements beyond current assistant logic.
- Google Tasks integration (separate feature).

## Design Considerations
- Keep the current calendar layout intact; only wire real events into existing UI.
- Indicate the source calendar for each event (name or color).
- Connection status should live in the AI assistant panel where the error currently appears.

## Technical Considerations
- OAuth client credentials file is `GoogleCalendarTasksAPI.json` at repo root.
- Token file is expected at repo root as `.google-tokens.json`; verify presence and readability.
- Use the existing OAuth reconnect flow (`/api/google/auth`) when tokens are missing or expired.
- Ensure token refresh is handled if refresh tokens exist.
- Respect calendar time zones when creating or displaying events.
- If multiple calendars exist, decide how the assistant chooses the target calendar (default to primary when unspecified).

## Success Metrics
- Asking the AI assistant to add an event creates it in Google Calendar and it appears in the UI within one refresh.
- Asking the AI assistant to find events returns results from at least two calendars when available.
- "Not connected" message no longer appears when valid tokens exist.

## Open Questions
- Should delete operations require a confirmation step in the assistant UI?
- Should the assistant ever ask which calendar to use, or always default to primary unless specified?
