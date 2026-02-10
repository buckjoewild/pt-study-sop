# File Path Analysis - PT-Study-SOP Project

## Executive Summary
Your friend's project **works** but has scattered, inconsistent file path management across multiple layers. There are **~10 major categories of path issues** that are technically functional but create maintenance debt, fragility, and potential runtime errors.

---

## 🔴 CRITICAL ISSUES (Likely Causing Bugs)

### 1. **Duplicate Path Definitions**
Multiple files define the same directories independently:

| Definition | Location | Pattern |
|-----------|----------|---------|
| `DATA_DIR` | `brain/config.py` (L47) | `os.path.join(BASE_DIR, 'data')` |
| `DATA_DIR` | `brain/dashboard/gcal.py` (L42) | `Path(__file__).parent.parent / "data"` |
| `SCRIPT_DIR` | `brain/anki_sync.py` (L27) | `Path(__file__).resolve().parent` |
| `SCRIPT_DIR` | `brain/card_dedupe.py` (L25) | `Path(__file__).resolve().parent` |
| `SCRIPT_DIR` | `brain/dedupe_course_events.py` (L12) | `Path(__file__).resolve().parent` |

**Problem**: If `brain/` is moved or renamed, only some files will break (the ones with hardcoded path calculations). Others using imported `DATA_DIR` from config will adjust, others won't.

**Example**: `gcal.py` uses its own `DATA_DIR` instead of importing from config, so if config moves, they diverge:
```python
# brain/config.py (single source of truth)
DATA_DIR = os.path.join(BASE_DIR, 'data')

# brain/dashboard/gcal.py (redundant definition - can diverge!)
DATA_DIR = Path(__file__).parent.parent / "data"  # Works NOW but breaks if structure changes
```

---

### 2. **Mixed Path Libraries (os.path vs pathlib.Path)**

The codebase uses **both** libraries inconsistently:

**Old style (os.path)** - used in 60+ places:
```python
# brain/config.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
```

**Modern style (pathlib)** - used in 30+ places:
```python
# brain/dashboard/gcal.py
DATA_DIR = Path(__file__).parent.parent / "data"

# scripts/trigger_run.py
repo_root = Path(__file__).parent.parent.resolve()
sys.path.insert(0, str(repo_root))
```

**Problem**: Can't easily refactor. String paths from `os.path` don't play well with `Path` objects in type hints.

---

### 3. **Inconsistent Root Path Calculations**

The project root is calculated **4 different ways**:

| Pattern | File(s) | Result |
|---------|---------|--------|
| `Path(__file__).resolve().parent.parent` | `brain/dashboard_web.py` (L12) | `c:\brucebruce\trey\` |
| `Path(__file__).resolve().parent.parent.parent` | `brain/dashboard/api_adapter.py` (L2672) | Via 3 parent calls |
| `Path(__file__).resolve().parents[1]` | `scripts/repair_and_run.py` (L10) | Via index access |
| `Path(__file__).resolve().parents[2]` | `scripts/build_proposal_sheet.py` (L11) | Via different index |

**Problem**: 
- If folder depth changes, some break
- Not clear which is correct without counting
- Tests might work from one location but fail from another

---

### 4. **sys.path Manipulation - Scattered & Redundant**

Found **20+ sys.path mutations** across files:

```python
# brain/dashboard_web.py (L13)
sys.path.append(str(project_root))

# brain/tutor_engine.py (L33)
sys.path.insert(0, str(Path(__file__).parent))

# brain/test_gcal.py (L6)
sys.path.append(os.getcwd())  # ⚠️ DEPENDS ON CWD!

# brain/tests/test_wrap_parser.py (L5-12)
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))
if str(brain_dir) not in sys.path:
    sys.path.append(str(brain_dir))  # Both? Why?

# brain/tests/test_methods_api.py (L15)
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
```

**Problems**:
1. ⚠️ **Working Directory Dependency**: `test_gcal.py` assumes you run from a specific directory
2. **Duplicate sys.path entries**: Same dir added multiple times
3. **import order matters**: Some files execute sys.path before imports, others after
4. **No deduplication**: Multiple scripts repeat the same logic

---

### 5. **Flask Static/Template Path Assumptions**

The Flask app has complex nested path logic to find assets:

```python
# brain/dashboard/app.py (L15-20)
base_dir = os.path.dirname(os.path.abspath(__file__))  # brain/dashboard/
brain_dir = os.path.dirname(base_dir)                    # brain/
template_dir = os.path.join(brain_dir, "templates")       # brain/templates/
static_dir = os.path.join(brain_dir, "static")            # brain/static/
```

Then later:
```python
# L61-84: Multiple fallback attempts to find dist assets
dist_candidate = os.path.join(app.static_folder or "", "dist", path)
assets_candidate = os.path.join(app.static_folder or "", "dist", path)
dist_index = os.path.join(app.static_folder or "", "dist", "index.html")
```

**Problem**: If static assets move, 4+ places need updating. Uses `app.static_folder or ""` which is fragile.

---

### 6. **Vite Build Output Path - Hardcoded in Config**

```typescript
// dashboard_rebuild/vite.config.ts (L30-31)
build: {
    outDir: path.resolve(import.meta.dirname, "..", "brain", "static", "dist"),
```

The path is:
- ✅ Relative to `vite.config.ts`
- ❌ Hardcoded string: `"..", "brain", "static", "dist"`
- ❌ If folder moves, breaks. No env var fallback

**VS.** The build script documents this:
```powershell
# build-and-sync.ps1 (L36)
Write-Success "Build completed - files now in brain/static/dist"
```

Good documentation, but if someone changes one without the other, they diverge.

---

### 7. **env File Loading - Multiple Patterns**

Three different ways to find `.env`:

```python
# brain/config.py (L19) - PREFERRED
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")

# brain/dashboard/api_adapter.py (L34-35) - ALSO LOOKS
env_path = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"
)  # Expects .env one level up from api_adapter.py

# Imports from config instead would be better
```

**Problem**: `.env` might exist at:
- `brain/.env`
- `brain/dashboard/.env`
- Both (which wins?)

---

### 8. **Relative Path String Assumptions**

Multiple places assume relative paths will work from specific directories:

```python
# brain/dashboard/routes.py (L81)
os.makedirs(DATA_DIR, exist_ok=True)  # DATA_DIR imported from config - OK

# brain/tests/test_methods_api.py (L15)
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))  # FRAGILE
```

**Problem**: Tests might pass when run from project root but fail in CI/CD.

---

## 🟡 MODERATE ISSUES (Design Debt)

### 9. **No Centralized Path Constants Module**

Currently:
- `config.py` has base paths
- `gcal.py` redefines some
- Scripts define their own
- Flask app builds paths dynamically

**Better approach**: Single `brain/paths.py`:
```python
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
BRAIN_DIR = PROJECT_ROOT / "brain"
DATA_DIR = BRAIN_DIR / "data"
SESSION_LOGS_DIR = BRAIN_DIR / "session_logs"
DASHBOARD_REBUILD = PROJECT_ROOT / "dashboard_rebuild"
# etc.
```

---

### 10. **Frontend-Backend Path Coordination Missing**

**Frontend assets build to:**
```typescript
// vite.config.ts
outDir: path.resolve(import.meta.dirname, "..", "brain", "static", "dist")
```

**Flask expects files at:**
```python
# app.py
dist_index = os.path.join(app.static_folder or "", "dist", "index.html")
```

**But validation is minimal:**
```python
if os.path.exists(static_candidate):  # Just checks - doesn't help much
```

**Problem**: If build outputs wrong location, Flask silently 404s. No error message pointing to the real issue.

---

## 📊 PATH ISSUE SUMMARY TABLE

| Issue | Severity | Frequency | Impact |
|-------|----------|-----------|--------|
| Duplicate `DATA_DIR` definitions | 🔴 High | 2 locations | Can diverge |
| `os.path` vs `Path` mixing | 🔴 High | 90+ uses | Refactoring blocking |
| Multiple root calculations | 🔴 High | 4+ patterns | Structure fragility |
| sys.path mutations | 🔴 High | 20+x | Runtime depends on CWD |
| Flask path logic | 🟡 Medium | 5+ places | Cascading updates needed |
| env file loading | 🟡 Medium | 3 patterns | Order-dependent |
| Relative path assumptions | 🟡 Medium | 10+ cases | CI/CD fragile |
| No path constants | 🟡 Medium | Project-wide | Scattered magic strings |
| Build vs serve mismatch | 🟡 Medium | 2 places | Silent failures |
| Test working dir deps | 🟠 Low | 5 tests | Local pass, CI fail |

---

## 🔧 Quick Wins (Easy Fixes)

### 1. **Consolidate DATA_DIR** (5 min)
Remove `gcal.py` line 42-44, import from config instead:
```python
# brain/dashboard/gcal.py - DELETE these:
# DATA_DIR = Path(__file__).parent.parent / "data"
# TOKEN_PATH = DATA_DIR / "gcal_token.json"
# CONFIG_PATH = DATA_DIR / "api_config.json"

# REPLACE with:
from config import DATA_DIR
TOKEN_PATH = Path(DATA_DIR) / "gcal_token.json"
CONFIG_PATH = Path(DATA_DIR) / "api_config.json"
```

### 2. **Fix test working directory dependency** (10 min)
Replace in tests:
```python
# BEFORE
sys.path.append(os.getcwd())

# AFTER
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))
```

### 3. **Add path validation to Flask startup** (10 min)
```python
# brain/dashboard/app.py
def create_app():
    # ... existing code ...
    
    # VALIDATE build output exists
    dist_dir = os.path.join(app.static_folder or "", "dist")
    if not os.path.exists(dist_dir):
        raise FileNotFoundError(
            f"Dashboard build not found at {dist_dir}\n"
            f"Run: npm run build in dashboard_rebuild/"
        )
    
    return app
```

### 4. **Standardize to pathlib** (30 min, medium effort)
Convert config.py to all `Path` objects:
```python
# brain/config.py
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
SESSION_LOGS_DIR = BASE_DIR / "session_logs"
```

---

## 🏗️ Recommended Long-Term Fix

### Create `brain/paths.py`:
```python
"""Centralized path definitions for PT-Study-SOP."""
from pathlib import Path

# Single source of truth
PROJECT_ROOT = Path(__file__).resolve().parent.parent
BRAIN_DIR = PROJECT_ROOT / "brain"

# Core data paths
DATA_DIR = BRAIN_DIR / "data"
SESSION_LOGS_DIR = BRAIN_DIR / "session_logs"
OUTPUT_DIR = BRAIN_DIR / "output"

# Static assets
STATIC_DIR = BRAIN_DIR / "static"
DIST_DIR = STATIC_DIR / "dist"
TEMPLATES_DIR = BRAIN_DIR / "templates"

# Frontend
DASHBOARD_REBUILD = PROJECT_ROOT / "dashboard_rebuild"
DASHBOARD_CLIENT = DASHBOARD_REBUILD / "client"

# Ensure all dirs exist
for path in [DATA_DIR, SESSION_LOGS_DIR, OUTPUT_DIR, STATIC_DIR]:
    path.mkdir(parents=True, exist_ok=True)
```

Then in `config.py`:
```python
from paths import DATA_DIR, SESSION_LOGS_DIR, OUTPUT_DIR
```

And in `app.py`:
```python
from paths import TEMPLATES_DIR, STATIC_DIR, DIST_DIR

def create_app():
    app = Flask(
        __name__,
        template_folder=str(TEMPLATES_DIR),
        static_folder=str(STATIC_DIR)
    )
```

---

## 📋 Files to Review/Update

**Priority 1 (Critical):**
- `brain/config.py` - Consolidate all path defs here
- `brain/dashboard/app.py` - Use imported paths from config
- `brain/dashboard/gcal.py` - Remove duplicate data_dir definitions

**Priority 2 (Important):**
- `brain/tests/*.py` - Fix sys.path, remove cwd dependency
- `dashboard_rebuild/vite.config.ts` - Add env var support for build output
- `brain/dashboard_web.py` - Use pathlib, not mixed styles

**Priority 3 (Nice to have):**
- All other brain scripts - Standardize to use config.py
- Add a `paths.py` module

---

## ✅ What Works Well

- ✅ Flask server finds assets (complex but functional)
- ✅ Build pipeline works (documented in AGENTS.md)
- ✅ Config.py has most paths defined centrally
- ✅ Using relative paths prevents some absolute path brittle-ness

---

## 🚨 What Could Break It

1. Running tests from different directory
2. Moving `dashboard_rebuild/` folder
3. Changing `brain/` folder name
4. Deploying without `Start_Dashboard.bat` (paths may differ)
5. Refactoring to use `pathlib` everywhere at once (incomplete updates)

