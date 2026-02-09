# Agent Guidelines - PT Study SOP

## ⚠️ CRITICAL - Read This First

### How To Run The Server (DO NOT SKIP)

**NEVER** use `npm run dev` or `vite dev` for this project.

**ALWAYS** use the batch file:
```batch
C:\pt-study-sop\Start_Dashboard.bat
```

This will:
1. Build the UI directly to `brain/static/dist/` (one step!)
2. Start Python Flask server on **port 5000**
3. Open browser to `http://127.0.0.1:5000/brain`

---

## Quick Development Workflow (Streamlined!)

The build now outputs **directly** to `brain/static/dist` - no copy/sync step needed!

### Option 1: Double-click (Easiest)
```
C:\pt-study-sop\dashboard_rebuild\build-and-sync.bat
```

### Option 2: NPM Script
```powershell
cd C:\pt-study-sop\dashboard_rebuild
npm run deploy        # Build only
npm run deploy:open   # Build + open browser
```

### Option 3: PowerShell
```powershell
cd C:\pt-study-sop\dashboard_rebuild
.\build-and-sync.ps1          # Build
.\build-and-sync.ps1 -Reload  # Build + open browser
```

---

## What Changed?

**Before (3 steps):** Build → `dist/public` → Copy → `brain/static/dist`

**Now (1 step):** Build → `brain/static/dist` (direct!)

The Vite config now outputs directly to the Flask server's static folder.

---

## Project Structure

```
C:\pt-study-sop\
├── dashboard_rebuild\          # React frontend source
│   ├── client\src\             # All React components
│   ├── build-and-sync.ps1      # Build script (outputs to brain/)
│   ├── build-and-sync.bat      # Double-click version
│   └── BUILD.md                # Build instructions
├── brain\                       # Python Flask server
│   ├── static\dist\            # ★ BUILD OUTPUT GOES HERE
│   ├── dashboard_web.py        # Flask server entry
│   └── ...
├── Start_Dashboard.bat         # ★ USE THIS TO START SERVER
└── AGENTS.md                   # This file
```

---

## Common Mistakes To Avoid

| Mistake | Why It Fails |
|---------|--------------|
| `npm run dev` | Opens port 3000, doesn't serve Python API |
| Forgetting hard refresh | Browser shows old cached build |
| Multiple servers | Port conflicts - use `Start_Dashboard.bat` only |

---

## Key Files By Feature

| Feature | Source Location |
|---------|-----------------|
| Brain Page | `dashboard_rebuild/client/src/pages/brain.tsx` |
| Brain Components | `dashboard_rebuild/client/src/components/brain/` |
| BrainChat | `dashboard_rebuild/client/src/components/BrainChat/` |
| Layout/Footer | `dashboard_rebuild/client/src/components/layout.tsx` |
| Course Config | `dashboard_rebuild/client/src/config/courses.ts` |
| Error Boundaries | `dashboard_rebuild/client/src/components/ErrorBoundary.tsx` |

---

## Troubleshooting

Run these in browser console (F12):

```javascript
// Check viewport width
window.innerWidth

// See all fixed positioned elements
Array.from(document.querySelectorAll('.fixed')).map(e => ({
  class: e.className.slice(0, 50),
  bottom: getComputedStyle(e).bottom,
  zIndex: getComputedStyle(e).zIndex
}))
```

---

*Read the full guide: `docs/root/GUIDE_DEV.md`*
*Build details: `dashboard_rebuild/BUILD.md`*
