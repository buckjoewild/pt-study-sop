# WRAP Ingestion Milestones

**Created:** 2026-01-24
**Purpose:** Post-study WRAP ingestion workflow for Brain Chat

---

## Overview

After a study session, user pastes WRAP output from ChatGPT Tutor into Brain Chat. The system automatically:
1. Parses WRAP sections (A/B/C/D)
2. Merges notes into Obsidian (no duplicates)
3. Creates Anki card drafts
4. Logs session metrics
5. Captures tutor issues for Scholar analysis

---

## Existing Infrastructure

### Obsidian API (READY)
- **Location:** `brain/dashboard/api_adapter.py`
- **Plugin:** Obsidian Local REST API (`https://127.0.0.1:27124`)
- **Config:** `OBSIDIAN_API_KEY` in `brain/.env`

| Function | Description |
|----------|-------------|
| `obsidian_health_check()` | Check connection |
| `obsidian_list_files(folder)` | List files in folder |
| `obsidian_get_file(path)` | Read file content |
| `obsidian_save_file(path, content)` | Overwrite file |
| `obsidian_append(path, content)` | Append to file |

### Anki API (READY)
- **Location:** `brain/anki_sync.py` + `brain/dashboard/api_adapter.py`
- **Plugin:** AnkiConnect (`localhost:8765`)

| Endpoint | Description |
|----------|-------------|
| `GET /api/anki/status` | Connection check |
| `GET /api/anki/decks` | List decks |
| `GET /api/anki/drafts` | Get card drafts |
| `POST /api/anki/drafts/:id/approve` | Approve draft |
| `POST /api/anki/sync` | Sync to Anki |

### Brain Chat (PARTIAL)
- **Location:** `brain/dashboard/api_adapter.py` → `brain_chat()`
- Currently: LLM parses input, saves cards to drafts, optional Obsidian append
- Missing: WRAP format detection, merge logic, tutor issues

---

## WRAP Structure Reference

### Section A: Obsidian Notes Pack
- Session metadata (date, time, LO, mode, duration, source-lock)
- Map/buckets covered
- Key definitions
- Structure breakdowns
- Retrieval performed
- Mistakes & corrections
- Confusables addressed
- Artifacts created
- Next session plan

### Section B: Anki Cards
```
Front: [question]
Back: [answer]
Tags: [tag1;tag2;tag3]
Source: [source-lock reference]
```

### Section C: Spaced Retrieval Schedule
- R1/R2/R3/R4 dates (1-3-7-21 day intervals)
- Retrieval prompts for each review

### Section D: JSON Logs
- Tracker JSON: Basic metrics
- Enhanced JSON: Full detail (v9.3 schema)

---

## Milestones

### Milestone 1: Database Schema Update
**File:** `brain/db_setup.py`

Add tutor issues tracking table:

```sql
CREATE TABLE IF NOT EXISTS tutor_issues (
    id INTEGER PRIMARY KEY,
    session_id TEXT,
    issue_type TEXT,  -- 'hallucination', 'formatting', 'incorrect_fact', 'unprompted_artifact'
    description TEXT,
    severity TEXT,    -- 'low', 'medium', 'high'
    resolved INTEGER DEFAULT 0,
    created_at TEXT
);
```

**Tasks:**
- [ ] Add table creation to `init_database()`
- [ ] Run migration on existing DB

---

### Milestone 2: WRAP Parser Module
**File:** `brain/wrap_parser.py` (NEW)

Create parser to extract WRAP sections:

```python
def parse_wrap(raw_text: str) -> dict:
    """Parse WRAP output into structured sections."""
    return {
        "section_a": {...},  # Obsidian notes
        "section_b": [...],  # Anki cards
        "section_c": {...},  # Spaced schedule
        "section_d": {...},  # JSON logs
        "tutor_issues": [...],  # From mistakes & corrections
    }

def extract_obsidian_notes(wrap: dict) -> str:
    """Convert Section A to Obsidian markdown."""

def extract_anki_cards(wrap: dict) -> list:
    """Parse Section B into card dicts."""

def extract_spaced_schedule(wrap: dict) -> dict:
    """Parse Section C review dates."""

def extract_json_logs(wrap: dict) -> dict:
    """Parse Section D JSON metrics."""

def extract_tutor_issues(wrap: dict) -> list:
    """Extract issues from mistakes & corrections."""
```

**Tasks:**
- [ ] Create `wrap_parser.py`
- [ ] Implement section detection (regex for markers)
- [ ] Implement each extraction function
- [ ] Add unit tests

---

### Milestone 3: Obsidian Merge Logic
**File:** `brain/obsidian_merge.py` (NEW)

Smart merge instead of blind append:

```python
def read_existing_note(path: str) -> str:
    """Get current note content via Obsidian API."""

def diff_content(existing: str, new: str) -> dict:
    """Identify what's new vs already present."""

def merge_sections(existing: str, new: str) -> str:
    """Combine content without duplication."""

def add_concept_links(content: str, course: str) -> str:
    """Convert key terms to [[Wiki Links]]."""
    # Uses LLM to identify linkable concepts

def format_obsidian(content: str) -> str:
    """Apply Obsidian formatting: callouts, bold, highlights."""
```

**Tasks:**
- [ ] Create `obsidian_merge.py`
- [ ] Implement read/diff/merge functions
- [ ] Implement concept linking (LLM call)
- [ ] Implement formatting rules

---

### Milestone 4: Brain Chat WRAP Handler
**File:** `brain/dashboard/api_adapter.py`

Update `brain_chat()` to detect and route WRAP input:

```python
def brain_chat():
    # ... existing code ...
    
    # NEW: Detect WRAP format
    if is_wrap_format(message):
        wrap_data = parse_wrap(message)
        
        # 1. Obsidian merge
        notes = extract_obsidian_notes(wrap_data)
        merged = merge_to_obsidian(notes, course_folder)
        
        # 2. Anki cards to drafts
        cards = extract_anki_cards(wrap_data)
        save_card_drafts(cards)
        
        # 3. Log tutor issues
        issues = extract_tutor_issues(wrap_data)
        save_tutor_issues(issues, session_id)
        
        # 4. Store session metrics
        metrics = extract_json_logs(wrap_data)
        save_session(metrics)
        
        return wrap_response(...)
    
    # ... existing LLM flow ...
```

**Tasks:**
- [ ] Add `is_wrap_format()` detection
- [ ] Import and integrate wrap_parser
- [ ] Import and integrate obsidian_merge
- [ ] Add tutor issues DB insert
- [ ] Build wrap-specific response format

---

### Milestone 5: Tutor Issues API
**File:** `brain/dashboard/api_adapter.py`

Expose tutor issues for Scholar analysis:

```python
@adapter_bp.route("/tutor-issues", methods=["GET"])
def get_tutor_issues():
    """List all tutor issues."""

@adapter_bp.route("/tutor-issues", methods=["POST"])
def create_tutor_issue():
    """Log new tutor issue."""

@adapter_bp.route("/tutor-issues/<int:issue_id>", methods=["PATCH"])
def update_tutor_issue(issue_id):
    """Mark issue resolved or update."""

@adapter_bp.route("/tutor-issues/stats", methods=["GET"])
def get_tutor_issue_stats():
    """Get frequency by type for Scholar."""
```

**Tasks:**
- [ ] Add GET endpoint (list with filters)
- [ ] Add POST endpoint (create)
- [ ] Add PATCH endpoint (update/resolve)
- [ ] Add stats endpoint (aggregation)

---

### Milestone 6: Frontend Integration
**File:** `dashboard_rebuild/client/src/pages/brain.tsx`

Update Brain Chat UI for WRAP workflow:

**Tasks:**
- [ ] Add "Paste WRAP" button or auto-detect
- [ ] Show processing status indicator
- [ ] Display results summary:
  - Cards created count
  - Notes merged status
  - Issues logged count
- [ ] Link to Anki drafts panel
- [ ] Link to Obsidian note (if possible)

---

## Execution Order

| # | Milestone | Depends On | Est. Time |
|---|-----------|------------|-----------|
| 1 | DB Schema | — | 15 min |
| 2 | WRAP Parser | — | 1 hr |
| 3 | Obsidian Merge | M2 | 1 hr |
| 4 | Brain Chat Handler | M1, M2, M3 | 1 hr |
| 5 | Tutor Issues API | M1 | 30 min |
| 6 | Frontend | M4, M5 | 45 min |

**Total Estimate:** ~5 hours

---

## LLM Usage

| Task | LLM Needed? | Reason |
|------|-------------|--------|
| WRAP section parsing | ❌ No | Regex — clear markers |
| Anki card extraction | ❌ No | Structured format |
| JSON log extraction | ❌ No | Native JSON |
| Obsidian merge | ⚠️ Maybe | Can be deterministic |
| Concept link detection | ✅ Yes | Identify linkable terms |
| Tutor issue classification | ✅ Yes | Judgment on type/severity |

**Recommendation:** Keep DeepSeek V3 for concept linking and issue classification. No need for Claude/GPT-4.

---

## Files to Create/Modify

### New Files
- `brain/wrap_parser.py`
- `brain/obsidian_merge.py`

### Modified Files
- `brain/db_setup.py` — add tutor_issues table
- `brain/dashboard/api_adapter.py` — WRAP handler + tutor issues API
- `dashboard_rebuild/client/src/pages/brain.tsx` — UI updates

---

## Testing Checklist

- [ ] Paste sample WRAP → sections parsed correctly
- [ ] Anki cards appear in drafts
- [ ] Obsidian note created/merged (no duplicates)
- [ ] Tutor issues logged to DB
- [ ] Session metrics stored
- [ ] Frontend shows processing status
- [ ] Scholar can query tutor issues
