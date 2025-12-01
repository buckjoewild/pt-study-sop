# PT Study Brain 🧠

**A complete storage and analytics system for PT Study SOP v8.6 testing data**

Track your learning sessions, generate AI context summaries, and analyze your study patterns to optimize your learning workflow.

## 🎯 Overview

This system helps you:
- **Store** session data in a structured SQLite database
- **Track** progress across topics, study modes, and frameworks
- **Generate** AI-friendly session summaries for context persistence
- **Analyze** learning patterns and identify areas for improvement

Built for the PT Study SOP system that blends Justin Sung's PERRO method with Jim Kwik's memory techniques using the MAP → LOOP → WRAP workflow.

---

## 📁 Project Structure

```
pt_study_brain/
├── data/                      # Database storage
│   └── pt_study.db           # SQLite database (created on init)
├── session_logs/             # Your markdown session logs go here
│   └── *.md                  # Session log files
├── config.py                 # Configuration settings
├── db_setup.py              # Database schema and initialization
├── ingest_session.py        # Parse and store session logs
├── generate_resume.py       # Generate AI context summaries
├── dashboard.py             # Analytics and insights
├── requirements.txt         # Python dependencies (none needed!)
└── README.md               # This file
```

---

## 🚀 Quick Start

### 1. Setup (One-time)

```bash
# Navigate to the project directory
cd pt_study_brain

# Initialize the database
python db_setup.py
```

You should see:
```
✓ Database initialized at: /path/to/pt_study_brain/data/pt_study.db
```

### 2. Daily Workflow

**After each study session:**

1. Create a session log in `session_logs/` following the template (see below)
2. Ingest the session data:
   ```bash
   python ingest_session.py session_logs/2025-12-01_shoulder_anatomy.md
   ```

**Before starting a new session:**

1. Generate session resume for AI context:
   ```bash
   python generate_resume.py
   ```
2. Copy the output and paste it into your AI chat

**Anytime you want insights:**

```bash
python dashboard.py
```

---

## 📝 Session Log Template

Create a markdown file in `session_logs/` with this format:

```markdown
# Session Log - 2025-12-01

## Session Info
- Date: 2025-12-01
- Time: 14:30
- Topic: Shoulder Anatomy - Rotator Cuff
- Study Mode: Sprint
- Time Spent: 45 minutes

## Execution Details
- Frameworks Used: H-MAP, M-REP
- Gated Platter Triggered: Yes
- WRAP Phase Reached: Yes
- Anki Cards Created: 12

## Ratings
- Understanding Level: 4/5
- Retention Confidence: 4/5
- System Performance: 5/5

## Reflection

### What Worked
- H-MAP framework helped break down complex muscle attachments
- PERRO method made relationships clear between rotator cuff muscles
- Visual diagrams + spatial memory techniques = excellent retention

### What Needs Fixing
- Need to improve transition speed between MAP and LOOP phases
- Should have created more cross-reference cards

### Notes/Insights
- The SITS mnemonic (Supraspinatus, Infraspinatus, Teres minor, Subscapularis) 
  works perfectly with the spatial memory palace technique
- Understanding the functional anatomy first made memorization much easier
```

**Important formatting notes:**
- Use exact field names (e.g., "Date:", "Topic:", etc.)
- Study Mode must be one of: Sprint, Core, or Drill
- Ratings should be numbers 1-5
- Yes/No values should be "Yes" or "No"

---

## 📚 Script Usage

### ingest_session.py

**Purpose:** Parse markdown session logs and insert data into the database.

**Usage:**
```bash
python ingest_session.py <path_to_session_log.md>
```

**Example:**
```bash
python ingest_session.py session_logs/2025-12-01_shoulder_anatomy.md
```

**Output:**
```
📖 Reading session log: session_logs/2025-12-01_shoulder_anatomy.md
✓ Session ingested successfully!
  ID: 1
  Date: 2025-12-01 14:30
  Topic: Shoulder Anatomy - Rotator Cuff
  Mode: Sprint
```

**Error Handling:**
- Validates required fields
- Prevents duplicate entries (same date/time/topic)
- Shows helpful error messages for parsing issues

---

### generate_resume.py

**Purpose:** Generate a formatted summary of recent sessions for AI context.

**Usage:**
```bash
python generate_resume.py [limit]
```

**Examples:**
```bash
# Generate resume from last 10 sessions (default)
python generate_resume.py

# Generate resume from last 20 sessions
python generate_resume.py 20
```

**Output:**
- Prints markdown-formatted resume to console
- Saves to `session_resume.md` in the project root
- Ready to copy-paste into AI chat

**Resume includes:**
- Overview (total sessions, study time, Anki cards)
- Performance metrics (average scores)
- Study patterns (modes, frameworks used)
- Recent topics covered
- Areas needing review (low scores)
- Strong areas (high scores)
- What's working well
- Common issues
- Last 3 session details

---

### dashboard.py

**Purpose:** Display comprehensive analytics and insights.

**Usage:**
```bash
python dashboard.py
```

**Output sections:**

1. **Overview** - Total sessions, topics, time, cards, date range
2. **Performance Metrics** - Average scores with visual progress bars
3. **Study Patterns** - Mode distribution, framework usage, workflow completion
4. **Topic Analysis** - Weak/strong topics, most studied topics
5. **Time Breakdown** - Time by mode, recent activity
6. **Trends** - Performance trends over time (improving/declining/stable)
7. **Insights** - Actionable recommendations

**Example output:**
```
======================================================================
  PT STUDY BRAIN - ANALYTICS DASHBOARD
======================================================================

📊 OVERVIEW
-----------
  Total Sessions:        15
  Unique Topics:         12
  Total Study Time:      675 minutes (11h 15m)
  Total Anki Cards:      180
  Average Session Time:  45.0 minutes

📈 PERFORMANCE METRICS
----------------------
  Understanding Level     ████████████████░░░░ 4.2/5
  Retention Confidence    ███████████████░░░░░ 3.8/5
  System Performance      ██████████████████░░ 4.5/5
```

---

## 🛠️ Configuration

Edit `config.py` to customize settings:

```python
# Number of recent sessions to include in resume
RECENT_SESSIONS_COUNT = 10

# Thresholds for analytics
WEAK_THRESHOLD = 3    # Scores <= 3 are weak areas
STRONG_THRESHOLD = 4  # Scores >= 4 are strong areas
```

---

## 💾 Database Schema

The SQLite database stores sessions with these fields:

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| session_date | TEXT | Date (YYYY-MM-DD) |
| session_time | TEXT | Time (HH:MM) |
| topic | TEXT | Study topic |
| study_mode | TEXT | Sprint/Core/Drill |
| time_spent_minutes | INTEGER | Session duration |
| frameworks_used | TEXT | Comma-separated frameworks |
| gated_platter_triggered | TEXT | Yes/No |
| wrap_phase_reached | TEXT | Yes/No |
| anki_cards_count | INTEGER | Number of cards created |
| understanding_level | INTEGER | 1-5 rating |
| retention_confidence | INTEGER | 1-5 rating |
| system_performance | INTEGER | 1-5 rating |
| what_worked | TEXT | Reflection notes |
| what_needs_fixing | TEXT | Areas for improvement |
| notes_insights | TEXT | Additional insights |
| created_at | TEXT | Timestamp of ingestion |

**Unique constraint:** (session_date, session_time, topic) - prevents duplicates

---

## 🔍 Tips & Best Practices

### For Best Results:

1. **Be Consistent** - Log every session, even short ones
2. **Be Honest** - Accurate ratings help identify patterns
3. **Be Specific** - Detailed notes in "What Worked" and "What Needs Fixing" sections
4. **Review Weekly** - Run dashboard weekly to track trends
5. **Use AI Context** - Always generate resume before AI-assisted study sessions

### Session Naming Convention:

```
session_logs/YYYY-MM-DD_topic-name.md
```

Examples:
- `2025-12-01_shoulder_anatomy.md`
- `2025-12-02_knee_biomechanics.md`
- `2025-12-03_gait_analysis_review.md`

### Ratings Guide:

**Understanding Level:**
- 1 = Confused, need to restart
- 2 = Partial understanding, many gaps
- 3 = Basic understanding, some unclear points
- 4 = Good understanding, minor details to clarify
- 5 = Complete understanding, can teach it

**Retention Confidence:**
- 1 = Will forget immediately
- 2 = Might remember some parts tomorrow
- 3 = Can recall with effort this week
- 4 = Confident for next few weeks
- 5 = Locked in long-term memory

**System Performance:**
- 1 = System failed, very frustrating
- 2 = System hindered more than helped
- 3 = System worked okay, room for improvement
- 4 = System worked well, minor tweaks needed
- 5 = System worked perfectly, highly effective

---

## 🐛 Troubleshooting

### Database not found
```bash
python db_setup.py
```

### Duplicate session error
Check if you've already ingested that exact session (same date/time/topic). Each session must be unique.

### Parsing error
Ensure your markdown follows the exact template format with correct field names and structure.

### No data in dashboard
Make sure you've ingested at least one session first:
```bash
python ingest_session.py session_logs/your_session.md
```

---

## 📊 Example Workflow

**Monday morning - Starting new study session:**

```bash
# 1. Generate resume from previous sessions
python generate_resume.py

# 2. Copy output and paste into AI chat
# "Here's my study history. Help me plan today's session..."
```

**Monday evening - After completing session:**

```bash
# 1. Create session log
# File: session_logs/2025-12-01_muscle_origins.md

# 2. Ingest the session
python ingest_session.py session_logs/2025-12-01_muscle_origins.md

# 3. (Optional) Check immediate stats
python dashboard.py
```

**Sunday - Weekly review:**

```bash
# Generate comprehensive dashboard
python dashboard.py

# Review trends, weak areas, and plan next week's focus
```

---

## 🔮 Future Enhancements

Potential additions:
- Export data to CSV for external analysis
- Visualization graphs (matplotlib/plotly)
- Spaced repetition scheduling based on retention scores
- Integration with Anki to track actual review performance
- Web dashboard for mobile access
- Automatic backup functionality

---

## 📄 License

This is a personal study tool. Feel free to adapt it for your own learning system!

---

## 🙏 Acknowledgments

Built for the PT Study SOP v8.6 system which combines:
- **Justin Sung's PERRO method** - Preparation, Encoding, Retrieval, Review, Output
- **Jim Kwik's memory techniques** - Memory palaces, spatial learning
- **MAP → LOOP → WRAP workflow** - Structured learning phases

---

## 📞 Support

For issues or questions about this system, review:
1. This README
2. The example session template
3. The script output messages (they're designed to be helpful!)

---

**Happy learning! 🎓📚🧠**
