# UI Overhaul v9.4.2 - Master Plan

## Status
- [x] P1: Runtime bundle drift resolved (committed 8ac74c5f)
- [ ] P2: Golden path smoke (deferred - needs server)
- [ ] U7: Scholar Runnable (planned)
- [ ] U8: Planner CTA (planned)
- [ ] UI Pages: Dashboard/Brain/Scholar/Calendar (planned)

## Prerequisites Completed
Runtime bundle committed: `chore: update runtime bundle v9.4.1` (7 files)

## Implementation Tasks

### U7: Scholar Runnable (Backend + DB + Frontend)

#### DB Changes (brain/db_setup.py)
Add to `init_database()` before `conn.commit()`:

```sql
CREATE TABLE IF NOT EXISTS scholar_runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    started_at TEXT NOT NULL,
    ended_at TEXT,
    status TEXT DEFAULT 'running',
    error_message TEXT,
    triggered_by TEXT DEFAULT 'ui',
    params_json TEXT,
    digest_id INTEGER,
    proposals_created INTEGER DEFAULT 0,
    notes TEXT,
    FOREIGN KEY(digest_id) REFERENCES scholar_digests(id)
);
CREATE INDEX idx_scholar_runs_status ON scholar_runs(status);
CREATE INDEX idx_scholar_runs_started ON scholar_runs(started_at DESC);
```

#### Backend Endpoints (brain/dashboard/routes.py)

**POST /api/scholar/run**
- Create scholar_runs row with status='running'
- Call `run_scholar_orchestrator()` in background thread
- Return immediately: `{ok: true, run_id: id, status: 'running'}`

**GET /api/scholar/run/status**
- Return latest run: `{status, started_at, ended_at, digest_id, proposals_created}`

**GET /api/scholar/run/history**
- Return last 10 runs: `[{id, status, started_at, ended_at, proposals_created, error_message}]`

#### Backend Logic (brain/dashboard/scholar.py)

```python
def run_scholar_orchestrator(save_outputs=True, run_id=None):
    """
    Run full Scholar orchestration:
    1. Read last 30 days of sessions
    2. Generate digest via AI
    3. Create proposals from digest insights
    4. Update run status
    """
    # Implementation uses existing generate_weekly_digest + create proposals
    pass
```

#### Frontend (dashboard_rebuild/client/src/pages/scholar.tsx)

**Header changes:**
- Add "Run Scholar" primary button (blue/prominent)
- Show status pill: Idle | Running | Success | Failed
- Show "Last Run: [timestamp]"
- Add "View History" link (opens panel)

**History panel:**
- Collapsible panel below header
- Table of runs: date, status, proposals created, errors
- Auto-refresh every 5 seconds when running

### U8: Planner CTA After JSON Attach

#### Component: dashboard_rebuild/client/src/components/IngestionTab.tsx

**Success handler changes:**
After successful JSON attach:
```typescript
toast({
  title: "Session updated",
  description: "Generate planner tasks now?",
  action: (
    <Button onClick={() => generatePlannerTasks()}>Generate Now</Button>
  ),
  duration: 10000, // 10 seconds
});
```

**generatePlannerTasks function:**
- Call `api.planner.generate()`
- On success: invalidate planner queue query, show success toast
- On error: show error toast

### Page-by-Page UI Overhaul

#### Dashboard (Home)

**Changes:**
1. Remove `NextActions` component import and usage
2. Add compact preview component:
   ```typescript
   <CompactNextActions limit={3} />
   ```
3. Add prominent CTA:
   ```typescript
   <Button size="lg" onClick={() => navigate('/brain')}>
     Open Brain →
   </Button>
   ```
4. Make sections collapsible:
   - Add `Collapsible` wrapper around deadlines/courses/tasks
   - Persist state in localStorage: `dashboard-collapsed-sections`

#### Brain Page

**Tab renames (state variable):**
```typescript
const tabs = ['today', 'this_week', 'tools', 'data'];
const tabLabels = {
  today: 'TODAY',
  this_week: 'THIS WEEK', 
  tools: 'TOOLS',
  data: 'DATA'
};
```

**Tab content reorganization:**
- **TODAY:** SessionSnapshot + AttachJson + Today's Actions (NextActions filter=today)
- **THIS WEEK:** Full Planner Queue (NextActions filter=all) + StaleTopics
- **TOOLS:** TopicNoteBuilder + SyllabusViewTab + ObsidianVault + AnkiIntegration
- **DATA:** DataTablesSection + VaultGraph + ExportTools

**Rename IngestionTab:**
- Component display name: "Attach JSON to Session"
- Button text: "Attach JSON"

#### Scholar Page

**Tab reduction (7 → 3):**
```typescript
const tabs = ['summary', 'analysis', 'proposals'];
```

**Content migration:**
- **SUMMARY:** StudyHealthOverview + WhatsWorking/Concerns + ScholarChat
- **ANALYSIS:** Collapsible sections:
  - Tutor Audit (collapsed by default)
  - Question Pipeline (collapsed)
  - Evidence Review (collapsed)
  - Clusters (collapsed + Run Clustering button)
- **PROPOSALS:** ActiveProposals + ImplementationBundle + Archive (collapsed)

**Collapsible section component:**
```typescript
<CollapsibleSection title="Tutor Audit" defaultOpen={false}>
  <TutorAuditContent />
</CollapsibleSection>
```

#### Calendar Page

**Changes:**
1. Ensure view modes are mutually exclusive:
   ```typescript
   const [viewMode, setViewMode] = useState<'month'|'week'|'day'|'tasks'>('month');
   ```
2. Show only one view at a time based on `viewMode`
3. Add sidebar (collapsible):
   - MiniCalendar
   - CalendarList (pin/hide)
   - UpcomingDeadlines (from academic_deadlines)

## Testing Checklist

- [ ] `scripts/check_drift.ps1` passes
- [ ] `scripts/smoke_golden_path.ps1` passes (when server running)
- [ ] POST /api/scholar/run returns `{ok, run_id, status}`
- [ ] GET /api/scholar/run/status returns latest run
- [ ] Dashboard shows only 3 tasks + "Open Brain" button
- [ ] Brain has 4 tabs: TODAY, THIS WEEK, TOOLS, DATA
- [ ] Scholar has 3 tabs: SUMMARY, ANALYSIS, PROPOSALS
- [ ] JSON attach shows "Generate Now" toast

## Commit Strategy

1. **Commit 1:** `feat(scholar): add runnable endpoint + history tracking`
   - DB migration (scholar_runs table)
   - Backend endpoints
   - Frontend run button + status

2. **Commit 2:** `feat(ui): restructure Brain, Dashboard, Scholar tabs`
   - Tab renames and regrouping
   - NextActions deduplication
   - Ingestion rename

3. **Commit 3:** `feat(ui): Calendar view separation + polish`
   - Calendar/Toggle separation
   - Collapsible sections
   - Floating assistant

## Deferred Items

- Calendar Assistant floating widget (can be v9.4.3)
- Auto-generate planner after JSON attach (staying with CTA approach)
- Advanced-only Data tab filtering
