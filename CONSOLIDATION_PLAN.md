# Unified Dashboard & Path Structure - Implementation Plan

## Current State (Three Separate Systems)

```
OLD SYSTEM                V3 SYSTEM                  MODERN SYSTEM
├─ routes.py            ├─ v3_routes.py            ├─ dashboard_rebuild/
│  └─ Legacy HTML       │  └─ Broken paths*        │  └─ React App
│     (/dashboard, /)   │     (/v3, /api/v3)       │     (/, /brain, /calendar, etc.)
└─ Hardcoded paths  └─ Hardcoded paths  └─ Hardcoded paths

*v3_routes.py looks for: "dashboard_rebuild/code/templates" (DOESN'T EXIST)
```

---

## Target State (Single Unified System)

```
UNIFIED SYSTEM
├─ React App (PRIMARY UI)
│  ├─ / → Dashboard (home)
│  ├─ /brain → Brain (knowledge vault)
│  ├─ /calendar → Calendar
│  ├─ /scholar → Analytics
│  ├─ /tutor → Learning
│  ├─ /methods → Methods
│  └─ /library → Library
│
├─ Flask Backend (API ONLY)
│  ├─ /api/adapter/* → File adapter
│  ├─ /api/methods/* → Methods API
│  ├─ /api/chain-run/* → Chain runner
│  ├─ /api/tutor/* → Tutor engine
│  └─ /api/v3/* → Calendar/Analytics (backend)
│
└─ CENTRALIZED PATHS (brain/paths.py)
   ├─ PROJECT_ROOT
   ├─ BRAIN_DIR
   ├─ DATA_DIR
   ├─ STATIC_DIR
   ├─ DIST_DIR
   ├─ TEMPLATES_DIR
   └─ DASHBOARD_REBUILD
```

---

## File Structure After Consolidation

```
c:\brucebruce\trey\
├── brain/
│   ├── paths.py                    ⭐ NEW - Centralized path definitions
│   ├── config.py                   ✏️ UPDATED - Import from paths.py
│   ├── dashboard_web.py            ✏️ UPDATED - Use centralized paths
│   ├── dashboard/
│   │   ├── app.py                  ✏️ UPDATED - Use centralized paths
│   │   ├── routes.py               ✏️ UPDATED - Backend API only
│   │   ├── v3_routes.py            🗑️ DELETE - Broken, unused
│   │   ├── api_adapter.py          ✏️ UPDATED - Use centralized paths
│   │   ├── api_methods.py          ✏️ UPDATED - Use centralized paths
│   │   ├── api_tutor.py            ✏️ UPDATED - Use centralized paths
│   │   ├── api_chain_runner.py     ✏️ UPDATED - Use centralized paths
│   │   ├── gcal.py                 ✏️ UPDATED - Use centralized paths
│   │   ├── __init__.py             ✏️ UPDATED - Clean imports
│   │   └── ...
│   ├── static/
│   │   ├── dist/                   (React build output - kept as is)
│   │   ├── css/
│   │   └── images/
│   ├── templates/                  🗑️ DELETE - Flask templates (unused, replaced by React)
│   └── data/
│
├── dashboard_rebuild/
│   ├── vite.config.ts              ✏️ UPDATED - Reference centralized paths
│   ├── build-and-sync.ps1          ✏️ UPDATED - Use centralized paths
│   ├── build-and-sync.bat          ✏️ UPDATED - Use centralized paths
│   ├── client/src/
│   │   ├── App.tsx                 (No changes needed - routing is correct)
│   │   ├── main.tsx                (No changes needed)
│   │   ├── pages/
│   │   │   ├── dashboard.tsx       (Main home page)
│   │   │   ├── brain.tsx           (Knowledge vault)
│   │   │   ├── calendar.tsx        (Calendar view)
│   │   │   ├── scholar.tsx         (Analytics)
│   │   │   ├── tutor.tsx           (Learning interface)
│   │   │   ├── methods.tsx         (Methods)
│   │   │   └── library.tsx         (Materials)
│   │   └── ...
│   └── shared/                     (Shared types - no changes needed)
│
├── Start_Dashboard.bat             ✏️ UPDATED - Reference centralized paths  
└── AGENTS.md                       ✏️ UPDATED - New routing documentation
```

---

## Implementation Steps

### Phase 1: Create Centralized Paths Module ⭐

**File**: `brain/paths.py` (NEW)
- Single source of truth for all paths
- Export Path objects (modernize from os.path)
- Auto-create directories
- Validate paths on import

### Phase 2: Update Configuration ⚡

**Files**: 
- `brain/config.py` - Import from paths.py
- `brain/dashboard_web.py` - Use from paths
- `brain/dashboard/app.py` - Use from paths

### Phase 3: Update Backend APIs 🔌

**Files**:
- `brain/dashboard/routes.py` - Keep API handlers, import from paths
- `brain/dashboard/api_adapter.py` - Import from paths
- `brain/dashboard/api_methods.py` - Import from paths
- `brain/dashboard/api_tutor.py` - Import from paths
- `brain/dashboard/api_chain_runner.py` - Import from paths
- `brain/dashboard/gcal.py` - Import from paths

### Phase 4: Clean Up Flask Setup 🧹

**Files**:
- `brain/dashboard/app.py`:
  - Remove outdated blueprint registrations
  - Simplify 404 handler (React now handles all routes)
  - Register only: adapter, methods, chain_runner, tutor, v3_api
  - Remove old dashboard_bp and v3_bp (UI only)

**Changes**:
- DELETE: `brain/dashboard/v3_routes.py` (broken template paths)
- DELETE: Legacy routes from `routes.py` that serve HTML
- KEEP: `routes.py` API endpoints (used by React)

### Phase 5: Update Frontend Build 🏗️

**Files**:
- `dashboard_rebuild/vite.config.ts` - Use centralized paths reference
- `dashboard_rebuild/build.ts` - Use centralized paths reference
- `dashboard_rebuild/build-and-sync.ps1` - Cleaner paths
- `dashboard_rebuild/build-and-sync.bat` - Cleaner paths

### Phase 6: Update Startup Scripts 🚀

**Files**:
- `Start_Dashboard.bat` - Reference centralized paths
- `AGENTS.md` - Document unified structure

---

## Key Changes Summary

| Component | Old State | New State | Benefit |
|-----------|-----------|-----------|---------|
| **Paths** | Scattered (10+ places) | Centralized (paths.py) | Single source of truth |
| **Flask Routes** | 3 dashboard blueprints | 1 UI (React) + 4 API blueprints | No routing conflicts |
| **Templates** | Flask HTML files | React SPA | Unified modern UI |
| **Path Library** | Mixed os.path/Path | All Path objects | Consistent, modern |
| **Build Output** | Hardcoded strings | Centralized references | Updates in one place |
| **Entry Point** | Multiple routes | Single React app | Clear architecture |

---

## API Routes (After Consolidation)

```
GET/POST /api/adapter/*        → File ingest/export
GET/POST /api/methods/*        → Study methods
POST     /api/chain-run/*      → Chain execution
GET/POST /api/tutor/*          → Learning engine
GET      /api/v3/*             → Calendar data (backend compute)
```

**All served by Flask, all called by React frontend.**

---

## Data Directory Structure (Remains the Same)

```
brain/data/
├── pt_study.db              (SQLite database)
├── api_config.json          (Settings)
├── gcal_token.json          (Google Calendar)
├── study_rag/               (RAG documents)
├── session_logs/            (Session data)
├── project_files/           (User uploads)
└── ...
```

---

## Old Files to Delete

🗑️ **These will be removed:**
1. `brain/dashboard/v3_routes.py` - Broken, unused
2. `brain/templates/` directory - Served by Flask, replaced by React
3. Any legacy HTML template files in brain/

✅ **These will be kept:**
1. All API route handlers (routes.py, api_*.py)
2. All data/business logic
3. Database setup
4. Configuration

---

## Rollback Strategy

Each phase commits separately, so if something breaks:
1. Paths module is isolated (easy rollback)
2. Config changes are limited
3. Blueprint changes can be reverted
4. Frontend is already separate

---

## Testing Checklist

After each phase:
- [ ] App starts: `Start_Dashboard.bat`
- [ ] React routes load (/, /brain, /calendar, /scholar, /tutor, /methods, /library)
- [ ] API endpoints respond (/api/*, /api/tutor/*, etc.)
- [ ] Database operations work (upload, ingest, query)
- [ ] Build process succeeds: `npm run deploy` in dashboard_rebuild/
- [ ] Build outputs to correct directory: `brain/static/dist/`
- [ ] No path errors in logs
- [ ] No hardcoded paths in new code

---

## Success Criteria

✅ **Single unified React dashboard** with all functionality
✅ **Centralized paths module** (brain/paths.py)
✅ **Clean Flask routing** (API only, no old HTML)
✅ **No duplicate path definitions**
✅ **No hardcoded path strings**
✅ **Build process outputs to centralized location**
✅ **All old/broken dashboards removed**
✅ **Documentation updated**

