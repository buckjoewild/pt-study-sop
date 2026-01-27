# Brain Page Fixes: Dropdown CSS + Two-Way Google Tasks Sync

## Context

### Original Request
Fix 2 issues on the Brain page:
1. Dropdown menus have transparent backgrounds — text is unreadable
2. Local assignments (quiz/exam/assignment) need to sync to Google Tasks bidirectionally

### Interview Summary
**Key Discussions**:
- Sync scope: quiz, exam, assignment `course_events` only
- Target Google Tasks list: "School List"
- Completion sync: both directions (Google → local, local → Google)
- Deletion sync: both directions (delete locally → delete Google Task; Google Task deleted → delete local DB row)
- Existing helpers (`create_google_task`, `patch_google_task`, `delete_google_task`) exist but are unwired
- Bidirectional calendar sync at `gcal.py:716` is the pattern to follow
- CSS fix: `--popover` variable exists but dropdowns appear transparent

**Research Findings**:
- `brain/data/api_config.json` exists with structure `{"google_calendar": {"tasks_list_id": null, "tasks_list_name": null, ...}}`
- Config is loaded via `load_gcal_config()` which returns the `google_calendar` sub-dict
- Helpers at gcal.py:1220-1260 are functional (not stubs)
- `course_events.google_event_id` uses `task_` prefix for task IDs
- OAuth token already has tasks scope
- **Correct column names** (from `db_setup.py:265-289`): `type` (not event_type), `title` (not event_name), `date`, `due_date`, `status`, `google_event_id`, `google_synced_at`, `google_updated_at`, `updated_at`
- **No frontend gtasks sync button exists** — no references to `/api/gtasks/sync` in `dashboard_rebuild/client/src/`. Sync will be manual via curl or a future UI addition.

### Metis Review
**Identified Gaps** (addressed):
- Conflict resolution: Compare `google_updated_at` (local record of Google's last update) vs Google Task's `updated` field. If Google is newer → pull. If local `updated_at` is newer → push. Tie → local wins.
- Sync trigger: On-demand via API call (`curl -X POST /api/gtasks/sync`). No frontend button exists yet.
- Delete behavior: Two-way — delete locally → delete from Google; task deleted in Google → delete local course_event row from DB
- Existing data: First sync pushes all matching events, not just new ones
- Error UX: Log errors, skip failed items, continue — no toast/UI needed
- "School List" creation: Look up by name; if not found, create it automatically
- Duplicate prevention: Use `google_event_id` field as dedup key — skip if already has `task_` ID
- Deletion safety: See "Deletion Logic" section below. Key rule: only delete Google Tasks whose ID was previously stored as `task_{id}` in a local `course_event.google_event_id`. Manually added Google Tasks (no matching local record) are NEVER touched.
- `google_event_id` collision: Calendar sync and Tasks sync share the `google_event_id` column. Calendar events store bare IDs (no prefix), Tasks store `task_` prefixed IDs. A row that already has a calendar `google_event_id` (no `task_` prefix) must NOT be overwritten. Task sync only targets rows where `google_event_id IS NULL` or `google_event_id LIKE 'task_%'`.

---

## Work Objectives

### Core Objective
Fix dropdown visibility on Brain page and implement two-way Google Tasks sync for assignments.

### Concrete Deliverables
- Solid dark background on all Brain page dropdown menus
- `ensure_tasks_list()` function in gcal.py
- `push_assignments_to_google_tasks()` function in gcal.py
- `sync_tasks_bidirectional()` function in gcal.py
- Updated `/api/gtasks/sync` endpoint to support bidirectional sync
- Config updated to use "School List"

### Definition of Done
- [ ] All Brain page dropdowns have solid dark background (visual verify)
- [ ] Local quiz/exam/assignment events appear in Google Tasks "School List" after sync
- [ ] Completing a task in Google marks it complete locally on next sync
- [ ] Completing an event locally marks it complete in Google on next sync
- [ ] Deleting a local event removes the Google Task on next sync
- [ ] Deleting a Google Task removes the local course_event on next sync
- [ ] Existing calendar sync still works (regression)

### Must Have
- Bidirectional completion sync
- Bidirectional deletion sync
- Only sync quiz/exam/assignment types
- Use existing helper functions
- Auto-create "School List" if not found

### Must NOT Have (Guardrails)
- DO NOT modify existing `sync_bidirectional()` calendar function
- DO NOT add new OAuth scopes or change auth flow
- DO NOT sync event types beyond quiz/exam/assignment
- DO NOT add retry queues or background workers
- DO NOT delete manually-added Google Tasks (only delete tasks that were synced from local — identified by matching `google_event_id` with `task_` prefix)
- DO NOT do broad CSS theme refactoring — fix dropdown only

---

## Data Mapping (CRITICAL)

### course_events schema (db_setup.py:265-289)
| Column | Type | Usage |
|--------|------|-------|
| `type` | TEXT | Filter: `IN ('quiz', 'exam', 'assignment')` |
| `title` | TEXT | Maps to Google Task `title` |
| `date` | TEXT | Primary calendar date |
| `due_date` | TEXT | Maps to Google Task `due` (RFC3339). Use `due_date` if set, else `date` |
| `status` | TEXT | `pending`/`completed`/`cancelled`. Maps to Google Task `status`: `needsAction`/`completed` |
| `google_event_id` | TEXT | Stores `task_{google_task_id}` for synced tasks |
| `google_synced_at` | TEXT | Last sync timestamp |
| `google_updated_at` | TEXT | Google's `updated` timestamp (from API response) |
| `updated_at` | TEXT | Local last-modified timestamp |

### Helper Return Signatures (CRITICAL)
All Google Tasks helpers in gcal.py return `(value, error)` tuples:
- `fetch_task_lists()` → `(list_of_dicts, error_string_or_None)`
- `fetch_tasks(tasklist_id)` → `(list_of_task_dicts, error_string_or_None)`
- `create_google_task(tasklist_id, body)` → `(result_dict, error_string_or_None)`
- `patch_google_task(tasklist_id, task_id, body)` → `(result_dict, error_string_or_None)`
- `delete_google_task(tasklist_id, task_id)` → `(bool_success, error_string_or_None)`

### Error Handling: Fatal vs Per-Item
**Fatal errors** (abort entire sync, return `{"success": False, "error": "..."}`:
- Auth failure: `get_tasks_service()` returns None → "Not authenticated"
- Config failure: `load_gcal_config()` returns error → "Google Tasks not configured"
- List fetch failure: `fetch_tasks(list_id)` returns error → "Failed to fetch tasks: {error}"
- List lookup failure: `fetch_task_lists()` returns error → "Failed to fetch task lists: {error}"

**Per-item errors** (log, append to `errors[]`, continue to next item):
- `create_google_task()` fails for one event → skip that event
- `patch_google_task()` fails for one event → skip that event
- `delete_google_task()` fails for one task → skip that task
- DB update fails for one row → skip that row

At every callsite of existing helpers, unpack `(result, error)`. If fatal → return immediately. If per-item → append to errors, continue.

### New Function Return Contracts
New functions return dicts (matching `sync_bidirectional()` pattern):
- `ensure_tasks_list()` → returns `str` (list ID) on success. Returns `None` on failure (caller checks and returns fatal error).
- `push_assignments_to_google_tasks()` → returns `{"success": True, "created": N, "updated": M, "pulled": P, "deleted_remote": D, "errors": [...]}`. Returns `{"success": False, "error": "reason"}` on fatal failure.
- `sync_tasks_bidirectional()` → returns `{"success": True, "created": N, "updated": M, "pulled": P, "deleted_remote": D, "deleted_local": L, "errors": [...]}`. Returns `{"success": False, "error": "reason"}` on fatal failure.

**Endpoint contract** (routes.py):
```python
result = sync_tasks_bidirectional()
if result.get("success"):
    return jsonify(result), 200   # includes partial errors in "errors" list
else:
    return jsonify(result), 400   # fatal failure
```

### `cancelled` Status Handling
`course_events.status` can be `pending`, `completed`, or `cancelled`. Rules:
- **Unsynced cancelled**: Events with `status='cancelled'` AND `google_event_id IS NULL` are **excluded** from all sync queries. They are never pushed to Google.
- **Previously-synced then cancelled**: Events with `status='cancelled'` AND `google_event_id LIKE 'task_%'` are treated as **local deletions** → the corresponding Google Task will be deleted on next sync (via the delete-local→Google logic in Task 3 step 6). The local row is retained with its cancelled status.
- **Pull cancelled check**: If Google Task is completed but local is `cancelled` → skip pull (cancelled is a terminal local state, not overwritten by Google).
- **SQL for create/update queries** (Task 3 steps 3-5): `WHERE type IN ('quiz','exam','assignment') AND status != 'cancelled' AND (google_event_id IS NULL OR google_event_id LIKE 'task_%')`
- **SQL for local-set used in deletion** (Task 3 step 6): `SELECT google_event_id FROM course_events WHERE google_event_id LIKE 'task_%' AND status != 'cancelled'` — cancelled events with `task_` IDs are NOT in this set, so their Google Tasks become deletion candidates.

### Google Task Write Format (RFC3339)
For writing (create/patch), use these exact formats:
- `due`: Date-only RFC3339: `f"{date_str}T00:00:00.000Z"` where `date_str` is `YYYY-MM-DD` from `due_date` or `date`
- `status`: `"completed"` or `"needsAction"` (Google's only two values)
- `completed`: Set ONLY when `status == "completed"`: `datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")`. Clear (omit) when `status == "needsAction"`.
- `notes`: `"synced_by:pt-study-sop"` (set on create only, never update)

### Cache Invalidation for `tasks_list_id`
`ensure_tasks_list()` validates cached ID by calling `service.tasklists().get(tasklist=cached_id).execute()`. If this raises `googleapiclient.errors.HttpError` with `resp.status == 404`:
1. Clear `tasks_list_id` and `tasks_list_name` in config (set to `null`)
2. Re-run full lookup/create flow (Task 2 steps 2-6)
3. Return new ID
This is a single cheap API call that only runs when cache exists.

### DB Row Access (CRITICAL)
`get_connection()` returns a plain `sqlite3.Connection` with NO `row_factory` set. Existing code accesses results as tuples by index. For task sync functions, set `conn.row_factory = sqlite3.Row` at the start of each function so rows can be accessed as dicts (e.g., `row["title"]`). This is scoped to the connection and won't affect other code.

### `updated_at` Column
`course_events.updated_at` IS written by existing code — `api_adapter.py` sets it when events are created/updated via the API. Calendar sync in `gcal.py` also updates it. This means `updated_at` reliably reflects local changes and can be used for conflict resolution.

When task sync pulls changes from Google (e.g., marks local as completed), it must also update `updated_at = datetime.now().isoformat()`.

### Existing Timestamp Parsing Helpers (REUSE — DO NOT CREATE NEW ONES)
`brain/dashboard/gcal.py` already has:
- `parse_rfc3339(value)` at line 359 — parses RFC 3339 timestamps from Google API
- `parse_local_datetime(value)` at line 371 — parses local ISO timestamps

These are used in `sync_bidirectional()` for calendar conflict resolution (lines 819-820, 931-932). **Reuse these exact helpers** for task sync conflict resolution.

### Bidirectional Field Sync Scope
- **Push (local → Google)**: `title`, `due` (date), `status`, `notes` (marker)
- **Pull (Google → local)**: `status` ONLY. Title and due date are NOT pulled from Google — local is authoritative for those fields.
- **Rationale**: Users edit event details locally via the Dashboard. Google Tasks is only used for completion tracking and reminders.

### Conflict Resolution (timestamp-based)
**Null handling**: If `google_synced_at` is NULL → first sync for this row → always push.
If `updated_at` is NULL → never modified locally → if Google changed, pull; otherwise skip.

| Scenario | Compare | Action |
|----------|---------|--------|
| `google_synced_at` is NULL | — | Always push (first sync for this row) |
| Both changed since last sync | `updated_at` vs `google_updated_at` | Parse both as datetime, newer wins. Tie → local wins. |
| Only local changed | `updated_at` > `google_synced_at` | Push to Google |
| Only Google changed | Google `updated` > `google_updated_at` | Pull from Google |
| Neither changed | — | Skip |

### Google Task body format
```json
{
  "title": "course_events.title",
  "due": "course_events.due_date OR course_events.date (RFC3339 date: YYYY-MM-DDT00:00:00.000Z)",
  "status": "needsAction | completed",
  "completed": "RFC3339 timestamp (only when status=completed)"
}
```

### `google_event_id` Column Sharing (CRITICAL)
Calendar sync and Tasks sync share the `google_event_id` column:
- **Calendar events**: stored as bare Google Calendar event ID (no prefix)
- **Task events**: stored as `task_{google_task_id}` (with `task_` prefix)

**Rule**: Task sync ONLY operates on rows where `google_event_id IS NULL` OR `google_event_id LIKE 'task_%'`. Rows with a non-null, non-`task_` prefixed `google_event_id` are already calendar-synced and must NOT be overwritten by task sync.

### Deletion Logic

**App-created task identification**: To safely identify which Google Tasks were created by this system (even after local rows are deleted), use a **notes/description marker**. When creating a Google Task (Task 3), set `body["notes"] = "synced_by:pt-study-sop"`. This marker persists on the Google Task even after the local row is deleted.

**Local → Google**: After push, fetch all Google Tasks from "School List". Build a set of all local task IDs: `SELECT google_event_id FROM course_events WHERE google_event_id LIKE 'task_%'`. For each Google Task:
1. Check if `task_{task.id}` exists in the local set → if YES, skip (still synced)
2. If NOT in local set → check if `task.notes` contains `"synced_by:pt-study-sop"` → if YES, this was app-created and the local row was deleted → call `delete_google_task()`
3. If NOT in local set AND no marker in notes → skip (manually created by user, NEVER delete)

**Google → Local**: For each local `course_event` WHERE `google_event_id LIKE 'task_%'`: strip `task_` prefix, check if that ID exists in fetched Google Tasks list. If NOT found → task was deleted in Google → DELETE the local row.

**Safety**: Only Google Tasks with `notes` containing `"synced_by:pt-study-sop"` are eligible for deletion. Manually-added tasks are NEVER deleted.

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: YES (pytest)
- **User wants tests**: YES (tests after implementation)
- **Framework**: pytest

---

## Task Flow

```
Task 1 (CSS fix) → independent
Task 2 (School List lookup) → Task 3 (push function) → Task 4 (bidirectional sync) → Task 5 (wire endpoint)
Task 6 (testing) → depends on all above
```

## Parallelization

| Group | Tasks | Reason |
|-------|-------|--------|
| A | 1 | Independent CSS fix |
| B | 2, 3, 4, 5 | Sequential backend chain |

| Task | Depends On | Reason |
|------|------------|--------|
| 3 | 2 | Needs School List lookup |
| 4 | 3 | Builds on push function |
| 5 | 4 | Wires completed sync to endpoint |
| 6 | 1-5 | Tests everything |

---

## TODOs

- [ ] 1. Fix dropdown background CSS

  **What to do**:
  - Add explicit `bg-black` or `bg-zinc-900` class to `<SelectContent>` in `select.tsx`
  - Alternatively, fix the `--popover` CSS variable in `index.css` if it's being overridden
  - Verify all dropdowns on Brain page render with solid dark background

  **Must NOT do**:
  - Do not refactor the theme system
  - Do not change other component backgrounds

  **Parallelizable**: YES (independent of all other tasks)

  **References**:
  - `dashboard_rebuild/client/src/components/ui/select.tsx:70-100` — SelectContent component with `bg-popover` class
  - `dashboard_rebuild/client/src/index.css:53` — `--popover` CSS variable definition (`0 0% 8%`)
  - `dashboard_rebuild/client/src/pages/brain.tsx:892-910` — Brain page dropdowns using Select component

  **Acceptance Criteria**:
  - [ ] Dropdown menus on Brain page show solid dark background
  - [ ] Text in dropdowns is readable against background
  - [ ] Other page elements unaffected
  - [ ] Frontend rebuilt: `cd dashboard_rebuild && npm run build` (in Windows PowerShell)
  - [ ] Copy built files: `robocopy dist\public ..\brain\static\dist /E` (in Windows PowerShell)

  **Commit**: YES
  - Message: `fix(ui): add solid background to dropdown menus`
  - Files: `dashboard_rebuild/client/src/components/ui/select.tsx` or `index.css`

---

- [ ] 2. Implement School List lookup/creation in gcal.py

  **What to do**:
  - Add `ensure_tasks_list(list_name="School List")` function that:
    1. Check `api_config.json` → if `google_calendar.tasks_list_id` is not null AND `google_calendar.tasks_list_name == "School List"`, return cached ID. If name doesn't match (e.g., was set to "Reclaim" previously), clear and re-lookup.
    2. Call `fetch_task_lists()` to get all lists
    3. Find list matching name "School List"
    4. If not found, create it via `service.tasklists().insert(body={"title": "School List"})`
    5. Update `api_config.json` → set `google_calendar.tasks_list_id` and `google_calendar.tasks_list_name`
    6. Return the list ID
  - Config persistence: No `save_gcal_config()` exists. Write directly to `CONFIG_PATH` (`brain/data/api_config.json`):
    1. Read full JSON: `json.load(open(CONFIG_PATH))`
    2. Update: `config["google_calendar"]["tasks_list_id"] = list_id` and `config["google_calendar"]["tasks_list_name"] = "School List"`
    3. Write back: `json.dump(config, open(CONFIG_PATH, "w"), indent=2)`
    4. Use `CONFIG_PATH` constant already defined in gcal.py line 44

  **Must NOT do**:
  - Do not hardcode the list ID
  - Do not modify existing task list functions

  **Parallelizable**: NO (foundation for tasks 3-5)

  **References**:
  - `brain/dashboard/gcal.py:1017-1050` — `fetch_task_lists()` function (returns all lists)
  - `brain/data/api_config.json` — Config file structure: `{"google_calendar": {"tasks_list_id": null, "tasks_list_name": null, "client_id": "", ...}}`
  - `brain/dashboard/gcal.py:1220-1230` — `create_google_task()` pattern for service usage and `get_tasks_service()` call
  - `brain/dashboard/gcal.py` — Search for `load_gcal_config` and `save` patterns to find config persistence approach
  - `brain/dashboard/utils.py` — Check for config save utilities

  **Acceptance Criteria**:
  - [ ] `ensure_tasks_list()` returns valid list ID string
  - [ ] If "School List" exists in Google, finds and returns its ID
  - [ ] If "School List" doesn't exist, creates it and returns ID
  - [ ] `api_config.json` → `google_calendar.tasks_list_id` and `tasks_list_name` populated after first call
  - [ ] Subsequent calls with valid cache: make ONE `tasklists().get()` validation call (cheap), but NO `fetch_task_lists()` call (test: mock both, call twice, assert `fetch_task_lists` called exactly once on first call only; `get` called each time)
  - [ ] If cached `tasks_list_name` != "School List" (e.g., stale "Reclaim"), clears cache and re-lookups

  **Commit**: YES
  - Message: `feat(tasks): add School List lookup and auto-creation`
  - Files: `brain/dashboard/gcal.py`

---

- [ ] 3. Implement push_assignments_to_google_tasks()

  **What to do**:
  - Add `push_assignments_to_google_tasks(service=None)` function in gcal.py that:
    1. Call `ensure_tasks_list()` to get list ID
    2. **Fetch Google state first**: Call `(google_tasks, err) = fetch_tasks(list_id)`. If `err`, return error. Build `google_tasks_by_id = {task["id"]: task for task in google_tasks}`.
    3. Query DB: `SELECT * FROM course_events WHERE type IN ('quiz', 'exam', 'assignment') AND status != 'cancelled' AND (google_event_id IS NULL OR google_event_id LIKE 'task_%')`
    4. For each event WHERE `google_event_id IS NULL` (not yet synced to tasks):
       - Build Google Task body: `{"title": row["title"], "due": RFC3339(row["due_date"] or row["date"]), "status": "completed" if row["status"]=="completed" else "needsAction", "notes": "synced_by:pt-study-sop"}`
       - Call `(result, err) = create_google_task(list_id, body)`. If `err` → append to errors, continue.
       - UPDATE `course_events SET google_event_id = 'task_' || result['id'], google_synced_at = now_iso, google_updated_at = result['updated']`
    5. For each event WITH existing `task_` ID — **conflict resolution**:
       ```python
       task_id = google_event_id[5:]  # strip "task_" prefix
       google_task = google_tasks_by_id.get(task_id)
       if not google_task: continue  # handled by deletion logic

       # Use existing helpers: parse_local_datetime() for local, parse_rfc3339() for Google
       if not row["google_synced_at"]:
           action = "push"
       else:
           local_ts = parse_local_datetime(row["updated_at"])
           synced_ts = parse_local_datetime(row["google_synced_at"])
           google_updated_stored = parse_rfc3339(row["google_updated_at"])
           google_updated_actual = parse_rfc3339(google_task.get("updated"))

           local_changed = local_ts and synced_ts and local_ts > synced_ts
           google_changed = google_updated_actual and google_updated_stored and google_updated_actual > google_updated_stored

           if local_changed and not google_changed:
               action = "push"
           elif google_changed and not local_changed:
               action = "pull"
           elif local_changed and google_changed:
               action = "push" if local_ts >= google_updated_actual else "pull"
           else:
               action = "skip"

       if action == "push":
           (result, err) = patch_google_task(list_id, task_id, local_body)
           if err: append to errors, continue
           UPDATE google_synced_at = now_iso, google_updated_at = result["updated"]
       elif action == "pull":
           # Pull ONLY status (not title/due — local is authoritative for those fields)
           UPDATE local status from google_task["status"] (map "completed"→"completed", "needsAction"→"pending")
           UPDATE google_synced_at = now_iso, google_updated_at = google_task["updated"], updated_at = now_iso
       # "skip" → do nothing
       ```
    6. **Delete local→Google**: Build set of local `task_` IDs. For each Google Task NOT in local set: check `task.get("notes", "")` contains `"synced_by:pt-study-sop"` → if YES, call `(ok, err) = delete_google_task(list_id, task_id)`. If `err` → append to errors. If no marker → skip (user-created).
    7. Return: `{"success": True, "created": N, "updated": M, "pulled": P, "deleted_remote": D, "errors": [...]}`

  **Must NOT do**:
  - Do not sync event types beyond quiz/exam/assignment
  - Do not modify the course_events schema
  - Do not delete Google Tasks that were never synced from local (no matching `task_` ID in local DB)

  **Parallelizable**: NO (depends on task 2)

  **References**:
  - `brain/dashboard/gcal.py:1220-1260` — `create_google_task()`, `patch_google_task()`, `delete_google_task()` helpers
  - `brain/dashboard/gcal.py:1051-1096` — `fetch_tasks(tasklist_id)` function for reference on task body format and Google Task fields
  - `brain/dashboard/gcal.py:1098-1182` — `sync_tasks_to_database()` — shows how tasks are imported (reverse direction), DB update patterns
  - `brain/db_setup.py:265-289` — `course_events` table: columns are `type`, `title`, `date`, `due_date`, `status`, `google_event_id`, `google_synced_at`, `google_updated_at`, `updated_at`
  - `brain/dashboard/gcal.py:716-900` — `sync_bidirectional()` calendar function as structural pattern for the overall sync flow

  **Acceptance Criteria**:
  - [ ] Creates Google Tasks for unsynced quiz/exam/assignment events
  - [ ] Updates or pulls existing synced tasks using conflict resolution (local changed → push, Google changed → pull, both → newer wins)
  - [ ] New tasks include `notes: "synced_by:pt-study-sop"` marker
  - [ ] `google_event_id` populated with `task_{google_task_id}` for new syncs
  - [ ] `google_synced_at` and `google_updated_at` updated after each create/patch
  - [ ] Completed local events create completed Google Tasks (`status: "completed"`)
  - [ ] Deleted local events cause corresponding Google Tasks to be deleted
  - [ ] Returns `{"success": True, "created": N, "updated": M, "pulled": P, "deleted_remote": D, "errors": [...]}`. On fatal failure: `{"success": False, "error": "reason"}`

  **Commit**: YES
  - Message: `feat(tasks): push local assignments to Google Tasks`
  - Files: `brain/dashboard/gcal.py`

---

- [ ] 4. Implement sync_tasks_bidirectional()

  **What to do**:
  - Add `sync_tasks_bidirectional()` function in gcal.py that:
    1. Call `push_assignments_to_google_tasks()` — this handles: create new tasks, conflict-resolution push/pull for existing tasks, and local→Google deletion. Returns summary with created/updated/pulled/deleted_remote counts.
    2. **Delete sync (Google → local)**: After push completes, re-query: `SELECT * FROM course_events WHERE google_event_id LIKE 'task_%' AND status != 'cancelled'`. Fetch current Google Tasks from "School List" (or reuse from push). For each row:
       - Strip `task_` prefix → check if that ID exists in the Google Tasks list
       - If NOT found → task was deleted in Google → DELETE the local `course_event` row from DB
       - Count deletions
       - **Note**: Cancelled rows are excluded — they are retained locally even if their Google Task was deleted (cancelled is a terminal local state).
    3. Return combined summary: merge push summary + `{"deleted_local": L}`

  **Must NOT do**:
  - Do not modify `sync_bidirectional()` (calendar sync)
  - Do not import Google Tasks that don't match local events (no new task creation from Google)
  - Do not delete local events that were never synced (no `task_` prefix in `google_event_id`)

  **Parallelizable**: NO (depends on task 3)

  **References**:
  - `brain/dashboard/gcal.py:716-900` — `sync_bidirectional()` calendar function (structural pattern for two-way sync flow)
  - `brain/dashboard/gcal.py:1051-1096` — `fetch_tasks(tasklist_id)` to get tasks from Google (returns list of task dicts with `id`, `title`, `status`, `updated`, `due`)
  - `brain/dashboard/gcal.py:1098-1182` — `sync_tasks_to_database()` — existing import logic showing DB update patterns
  - `brain/db_setup.py:265-289` — `course_events` table: `status` values are `pending`/`completed`/`cancelled`

  **Acceptance Criteria**:
  - [ ] Calls `push_assignments_to_google_tasks()` which handles: create, conflict-resolution push/pull, and local→Google deletion
  - [ ] Completion pull is done by Task 3's conflict resolution (Google changed → pull); Task 4 does NOT duplicate this
  - [ ] Task 4's unique responsibility: Google→local DELETE sync (step 2 above)
  - [ ] Does not create/import unmatched Google Tasks
  - [ ] Deletes local course_events when corresponding Google Task is deleted (only for previously-synced events with `task_` prefix)
  - [ ] Does NOT delete local events that were never synced
  - [ ] Returns `{"success": True, "created": N, "updated": M, "pulled": P, "deleted_remote": D, "deleted_local": L, "errors": []}`. On fatal failure: `{"success": False, "error": "reason"}`
  - [ ] Does not affect existing calendar sync

  **Commit**: YES
  - Message: `feat(tasks): bidirectional task completion and deletion sync`
  - Files: `brain/dashboard/gcal.py`

---

- [ ] 5. Wire sync_tasks_bidirectional() to API endpoint

  **What to do**:
  - **Replace** the existing `/api/gtasks/sync` endpoint in `routes.py`: change `from .gcal import sync_tasks_to_database` to `from .gcal import sync_tasks_bidirectional` and call `sync_tasks_bidirectional()` instead
  - The old `sync_tasks_to_database(course_id)` import-only behavior is superseded — bidirectional sync handles both push AND pull (completion + deletion). The `course_id` param from request body is no longer used (sync targets all quiz/exam/assignment events across all courses for "School List")
  - Ensure the endpoint returns the sync summary as JSON with this exact schema:
    ```json
    // Success (HTTP 200):
    {"success": true, "created": 3, "updated": 1, "pulled": 2, "deleted_remote": 0, "deleted_local": 1, "errors": []}
    // Partial success (HTTP 200, some items failed):
    {"success": true, "created": 2, "updated": 0, "pulled": 0, "deleted_remote": 0, "deleted_local": 0, "errors": ["Failed to create task for 'Quiz 3': API error"]}
    // Auth failure (HTTP 400):
    {"success": false, "error": "Not authenticated"}
    // Config failure (HTTP 400):
    {"success": false, "error": "Google Tasks not configured"}
    ```
  - The `sync_tasks_bidirectional()` function should return the summary dict. The endpoint wraps it with `jsonify()`. If the function returns `{"error": ...}`, return HTTP 400.
  - **Note**: No frontend button currently triggers this endpoint. Verification is via curl only.

  **Must NOT do**:
  - Do not create new endpoints
  - Do not change endpoint URL or method
  - Do not add new frontend UI elements (out of scope)

  **Parallelizable**: NO (depends on task 4)

  **References**:
  - `brain/dashboard/routes.py:932-951` — Existing `/api/gtasks/sync` POST endpoint (currently calls `sync_tasks_to_database()`)
  - `brain/dashboard/routes.py:943-951` — Existing `/api/gtasks/lists` GET endpoint
  - `brain/dashboard/gcal.py` — Import the new `sync_tasks_bidirectional` function

  **Acceptance Criteria**:
  - [ ] `POST /api/gtasks/sync` calls `sync_tasks_bidirectional()`
  - [ ] Response includes `{"success": true, "created": N, "updated": M, "pulled": P, "deleted_local": X, "deleted_remote": Y}`
  - [ ] Old import-only `sync_tasks_to_database()` replaced by `sync_tasks_bidirectional()` (covers push + pull + delete)
  - [ ] `curl -X POST http://localhost:5000/api/gtasks/sync` returns valid JSON with sync summary

  **Commit**: YES
  - Message: `feat(tasks): wire bidirectional sync to API endpoint`
  - Files: `brain/dashboard/routes.py`

---

- [ ] 6. Integration testing and verification

  **What to do**:
  - Write pytest tests for the new functions in `brain/tests/test_gtasks_sync.py`:

    **Test isolation approach**:
    - **Google API mocking**: Use `unittest.mock.patch` on these targets (patch WHERE USED, not where defined):
      - `dashboard.gcal.get_tasks_service` → return mock service object
      - `dashboard.gcal.fetch_task_lists` → return `(mock_list_data, None)` (tuple!)
      - `dashboard.gcal.fetch_tasks` → return `(mock_task_list, None)` (tuple!)
      - `dashboard.gcal.create_google_task` → return `({"id": "test123", "updated": "2025-12-20T10:00:00Z"}, None)` (tuple!)
      - `dashboard.gcal.patch_google_task` → return `({"id": "test123", "updated": "..."}, None)` (tuple!)
      - `dashboard.gcal.delete_google_task` → return `(True, None)` (tuple!)
      - Note: all mock returns must be `(value, error)` tuples matching helper signatures
    - **SQLite isolation**: `gcal.py` imports `get_connection` via `from db_setup import get_connection`. Both `init_database()` and `get_connection()` use the global `db_setup.DB_PATH` (no path parameter). To isolate:
      1. Patch `db_setup.DB_PATH` to point to a temp file: `monkeypatch.setattr(db_setup, "DB_PATH", str(tmp_path / "test.db"))`
      2. Then call `db_setup.init_database()` — it will create tables in the temp DB
      3. Also patch `dashboard.gcal.get_connection` to use the same temp path: return `sqlite3.connect(str(tmp_path / "test.db"))` with `row_factory = sqlite3.Row`
      4. Do NOT use `:memory:` (each `connect()` call creates separate DB)
    - **Config file isolation**: Use `tmp_path` fixture. Write test `api_config.json` with `{"google_calendar": {"tasks_list_id": null, "tasks_list_name": null}}` to temp dir. Patch `dashboard.gcal.CONFIG_PATH` to point to the temp config file (gcal.py reads `CONFIG_PATH` directly at line 44).
    - **Import style**: Match existing test patterns in `brain/tests/`. Tests import from `dashboard.gcal` (not `brain.dashboard.gcal`) since tests run from `brain/` directory.

    **Test cases**:
    - `test_ensure_tasks_list_cached()` — pre-populate config with `tasks_list_id`, verify no API call
    - `test_ensure_tasks_list_lookup()` — mock `fetch_task_lists` returning list with "School List", verify ID returned
    - `test_ensure_tasks_list_create()` — mock empty list, verify `tasklists().insert()` called, config written
    - `test_push_creates_new_tasks()` — insert test course_events in temp DB, mock create, verify `google_event_id` updated
    - `test_push_skips_calendar_synced()` — insert event with bare `google_event_id` (calendar-synced), verify NOT pushed
    - `test_push_updates_changed_tasks()` — insert event with `task_` ID and `updated_at > google_synced_at`, verify patch called
    - `test_push_deletes_removed_local()` — mock Google Task not in local DB, `notes` contains `"synced_by:pt-study-sop"`, verify `delete_google_task()` called with correct args
    - `test_push_skips_user_created_task()` — mock Google Task not in local DB, `notes` does NOT contain marker, verify NOT deleted
    - `test_bidirectional_pulls_completion()` — mock Google Task as completed, local as pending, verify local updated
    - `test_bidirectional_deletes_google_removed()` — local has `task_` ID, mock Google Tasks missing it, verify local row deleted
    - `test_bidirectional_skips_unsynced()` — local event with NULL `google_event_id`, verify NOT deleted
  - Manual verification:
    - Start dashboard: `python brain/dashboard_web.py`
    - Trigger sync: `curl -X POST http://localhost:5000/api/gtasks/sync`
    - Check Google Tasks app for "School List" with assignments
    - Complete a task in Google, re-sync, verify local status updated
    - Delete a task in Google, re-sync, verify local row deleted
    - Verify dropdown backgrounds fixed (visual)
  - Regression: run existing test suite `pytest brain/ -q`

  **Must NOT do**:
  - Do not skip regression tests

  **Parallelizable**: NO (depends on all previous tasks)

  **References**:
  - `brain/tests/` — Existing test directory (check for test patterns and fixtures)
  - `brain/dashboard/gcal.py` — All new functions to test
  - `brain/dashboard/routes.py` — Endpoint to integration test

  **Acceptance Criteria**:
  - [ ] New pytest tests pass: `pytest brain/tests/ -q -k tasks`
  - [ ] Existing tests still pass: `pytest brain/ -q`
  - [ ] Manual sync creates tasks in Google Tasks "School List"
  - [ ] Completion sync works both directions
  - [ ] Deletion sync works both directions
  - [ ] Dropdowns have solid dark background
  - [ ] No regressions in calendar sync

  **Commit**: YES
  - Message: `test(tasks): add tests for bidirectional Google Tasks sync`
  - Files: `brain/tests/test_gtasks_sync.py`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `fix(ui): add solid background to dropdown menus` | select.tsx or index.css | Visual check |
| 2 | `feat(tasks): add School List lookup and auto-creation` | gcal.py | Unit test |
| 3 | `feat(tasks): push local assignments to Google Tasks` | gcal.py | Unit test |
| 4 | `feat(tasks): bidirectional task completion and deletion sync` | gcal.py | Unit test |
| 5 | `feat(tasks): wire bidirectional sync to API endpoint` | routes.py | curl test |
| 6 | `test(tasks): add tests for bidirectional Google Tasks sync` | test_gtasks_sync.py | pytest |

---

## Success Criteria

### Verification Commands
```bash
# Tests
pytest brain/ -q                    # Expected: all pass
pytest brain/tests/ -q -k tasks    # Expected: new tests pass

# API check
curl -X POST http://localhost:5000/api/gtasks/sync  # Expected: {"success": true, ...}

# Visual: open http://localhost:5000 → Brain page → check dropdowns
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] Dropdown backgrounds solid dark
- [ ] Tasks sync bidirectionally (create, update, complete, delete)
- [ ] Calendar sync unaffected
- [ ] All tests pass
