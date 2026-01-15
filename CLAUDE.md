# PT Study System - Claude Code Guide

## Project Overview
PT (Physical Therapy) Study System - A Flask-based web application for managing study sessions, notes, and learning materials with an 80s/90s arcade aesthetic.

## Tech Stack
- **Backend**: Flask (Python)
- **Frontend**: Vanilla HTML/CSS/JavaScript (no frameworks)
- **Styling**: Custom CSS with arcade/retro design system
- **Development**: Flask Hot Reload for instant updates

## Directory Structure
```
pt-study-sop/
├── brain/
│   ├── dashboard/          # Flask application
│   │   ├── app.py         # Main Flask app with HotReload
│   │   └── routes.py      # Route handlers
│   ├── templates/         # HTML templates
│   │   └── dashboard.html # Main dashboard template
│   ├── static/
│   │   ├── css/
│   │   │   └── dashboard.css  # Main stylesheet
│   │   ├── js/
│   │   │   └── dashboard.js   # Dashboard interactions
│   │   └── images/        # Static assets
│   └── session_logs/      # Study session data
├── sop/                   # Study protocols and modules
└── run.py                 # Application entry point
```

## Commands

### Development
```bash
# Start Flask server with debug mode
python run.py

# Or using Flask CLI
flask --app run:app run --debug

# Install dependencies
pip install flask flask-hot-reload
```

### Common Operations
- **Server restart**: Ctrl+C then `python run.py`
- **Hard browser refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- **Clear browser cache**: Ctrl+F5

## Design System & Aesthetic

### Theme: 80s/90s Arcade/Retro
**CRITICAL**: This project has a distinctive arcade aesthetic. Avoid generic modern web design patterns.

### Color Palette
- **Primary**: `#DC2626` (Retro Red) - Main accent color
- **Background**: Dark graphite (`#0A0A0A` to `#2A2A2A`)
- **Text**: `#F9FAFB` (primary), `#D1D5DB` (secondary)
- **Accents**: Cool grey (`#6B7280`)

### Typography
**DO USE**:
- `Orbitron` - Display font (headers, titles)
- `Space Grotesk` - Sans-serif (body text)
- `Press Start 2P` - Pixel font (accents)
- `VT323` - Terminal font (monospace)

**DO NOT USE**:
- Inter
- Roboto
- Helvetica
- Any generic system fonts

### UI Components Style
- **Buttons**: Chunky with 3px solid borders, arcade-style
- **Borders**: `3px solid` with `rgba(255, 255, 255, 0.08)`
- **Backgrounds**: Atmospheric gradients, NO solid colors
- **Effects**: Text glows, scanlines, retro shadows
- **Border Radius**: `6px` to `12px` (not too rounded)

### Header Design Principles
- Fixed header with explicit heights (current: 240px)
- Large display titles with dual-color glow effects
- Navigation buttons in arcade style (rounded rectangles)
- Brain logo on left, "LET'S STUDY" badge
- Custom GPT button on right

### Current Header Specifications
```css
.top-nav-header {
  height: 240px;  /* Explicit - DO NOT use auto */
}

.top-nav-title {
  /* "TREY'S" part */
  font-size: 6.075rem;

  /* "STUDY SYSTEM" part */
  font-size: 5.85rem;
}

.top-nav-center {
  gap: 48px;  /* Space between title and buttons */
}

.arcade-nav-btn {
  padding: 10px 24px;
  border: 3px solid #555555;
  font-size: 16px;
}
```

## Code Style & Conventions

### CSS
- Use CSS custom properties (variables) for all theme values
- Namespace with `--` prefix: `--primary`, `--surface-0`
- Keep arcade aesthetic consistent across all components
- Use explicit pixel values for heights (not `auto` or `%` for critical layouts)
- Prefer `rem` for font sizes, `px` for borders and gaps

### HTML
- Semantic HTML5 elements
- Use `role` and `aria-*` attributes for accessibility
- Keep structure simple - avoid unnecessary div nesting
- Use inline styles sparingly (only for testing)

### JavaScript
- Vanilla ES6+ (no jQuery or frameworks)
- Use `const`/`let`, avoid `var`
- Event delegation for dynamic content
- Keep functions small and focused

### Python/Flask
- Follow PEP 8 style guide
- Use type hints where beneficial
- Keep routes in `routes.py`
- Configuration in `config.py`

## Common Issues & Solutions

### CSS Changes Not Showing
✅ **SOLVED**: Flask Hot Reload is installed and configured
- Changes auto-reload in browser
- No manual refresh needed
- See console for file change notifications

### Header Layout Breaking
- Always use explicit `height` values for `.top-nav-header`
- Don't use `auto` or percentage heights on fixed headers
- Test changes with screenshots before/after

### Font Encoding Issues
- All files use UTF-8 encoding
- Special characters replaced with HTML entities
- Arrows: Use `&rarr;`, `&larr;` instead of Unicode

## Screenshot-Driven Development

When working on UI changes:
1. Take a screenshot of current state
2. Drag screenshot into Claude Code terminal
3. Describe desired changes
4. Let Claude see the visual context
5. Iterate 2-3 times for best results

## Context Management

### Use `/clear` Between Tasks
Clear conversation context when switching between:
- Different UI sections (header → content → sidebar)
- Different file types (CSS → HTML → Python)
- Different features (layout → styling → functionality)

This prevents context confusion and improves accuracy.

## What NOT to Do

### ❌ Avoid These Patterns
- Suggesting React, Vue, or any JS framework
- Using generic fonts (Inter, Roboto)
- Auto-height for fixed headers
- Solid background colors (use gradients)
- Generic "modern" UI patterns
- Creating unnecessary abstraction layers
- Over-engineering simple solutions

### ❌ Don't Change Without Permission
- The brain logo (left side)
- Core arcade aesthetic
- Color scheme (red primary)
- Font families

## File-Specific Notes

### `dashboard.css`
- ~4700+ lines - large file
- Uses CSS custom properties extensively
- Contains responsive breakpoints for mobile
- Header styles: lines 3531-3768
- Navigation buttons: arcade-nav-btn class

### `dashboard.html`
- Main template with header, nav, content sections
- Cache-busting with `{{ cache_bust }}` template variable
- Inline styles only for quick testing/iteration
- Title structure: `<span>TREY'S</span> <span>STUDY SYSTEM</span>`

### `app.py`
- Flask Hot Reload initialized on line 25
- Cache-busting headers configured
- Templates auto-reload enabled
- Static files in `brain/static/`

## Development Workflow

1. **Make changes** to CSS/HTML/JS files
2. **Save** the file
3. **Watch** browser auto-reload (Flask Hot Reload)
4. **Take screenshot** if UI change
5. **Show Claude** for feedback/iteration
6. **Repeat** 2-3 times for polish

## Testing Checklist

Before considering UI changes complete:
- [ ] Desktop view (1920x1080)
- [ ] Mobile view (responsive breakpoints)
- [ ] Browser refresh shows changes instantly
- [ ] No console errors
- [ ] Arcade aesthetic maintained
- [ ] Typography readable
- [ ] Colors from design system

## Notes for Claude

- **Be specific**: Reference exact line numbers and file paths
- **Visual context**: Ask for screenshots to verify changes
- **Iterate**: First version is good, 2-3 iterations are better
- **Explicit values**: Use specific pixel/rem values, not "reasonable" or "auto"
- **Preserve aesthetic**: Keep the arcade vibe in all suggestions

---

*Last updated: 2026-01-14*
*Flask Hot Reload: ✅ Installed*
*Cache Busting: ✅ Active*
