
import re
from collections import Counter
from datetime import datetime, timedelta
from config import (
    WEAK_THRESHOLD,
    STRONG_THRESHOLD,
)
from dashboard.cli import get_all_sessions

def analyze_sessions(sessions):
    """
    Lightweight analytics for dashboard cards (v9.1 schema).
    """
    if not sessions:
        return {}

    def average(key):
        vals = [s[key] for s in sessions if s.get(key) is not None]
        return sum(vals) / len(vals) if vals else 0

    avg_understanding = average("understanding_level")
    avg_retention = average("retention_confidence")
    avg_performance = average("system_performance")

    # Study modes
    mode_counts = Counter(s["study_mode"] for s in sessions if s.get("study_mode"))

    # Frameworks
    frameworks = Counter()
    for s in sessions:
        fw = s.get("frameworks_used") or ""
        for token in re.split(r"[;,/]", fw):
            token = token.strip()
            if token:
                frameworks[token] += 1

    # Topics with recency
    topics = {}
    for s in sessions:
        topic = s.get("topic") or s.get("main_topic")
        if not topic:
            continue
        date = s.get("session_date") or ""
        if topic not in topics or date > topics[topic]:
            topics[topic] = date
    topics_covered = sorted(
        ({"topic": t, "date": d} for t, d in topics.items()),
        key=lambda x: x["date"],
        reverse=True,
    )

    # Weak / strong topics
    weak = []
    strong = []
    for topic in topics:
        t_sessions = [
            s for s in sessions
            if (s.get("topic") or s.get("main_topic")) == topic
            and s.get("understanding_level") is not None
        ]
        if not t_sessions:
            continue
        avg_u = sum(s["understanding_level"] for s in t_sessions) / len(t_sessions)
        last_date = max(s.get("session_date") or "" for s in t_sessions)
        entry = {"topic": topic, "understanding": round(avg_u, 2), "date": last_date}
        if avg_u < WEAK_THRESHOLD:
            weak.append(entry)
        if avg_u >= STRONG_THRESHOLD:
            strong.append(entry)

    weak = sorted(weak, key=lambda x: x["understanding"])
    strong = sorted(strong, key=lambda x: x["understanding"], reverse=True)

    what_worked_list = [s["what_worked"] for s in sessions if s.get("what_worked")]
    common_issues = [s["what_needs_fixing"] for s in sessions if s.get("what_needs_fixing")]

    return {
        "avg_understanding": avg_understanding,
        "avg_retention": avg_retention,
        "avg_performance": avg_performance,
        "study_modes": mode_counts,
        "frameworks_used": frameworks,
        "topics_covered": topics_covered,
        "weak_areas": weak,
        "strong_areas": strong,
        "what_worked_list": what_worked_list,
        "common_issues": common_issues,
    }


def build_stats():
    raw_sessions = get_all_sessions()

    # Normalize field names to UI expectations
    sessions = []
    for s in raw_sessions:
        d = dict(s)
        d["topic"] = d.get("main_topic") or d.get("topic") or ""
        d["time_spent_minutes"] = d.get("duration_minutes") or d.get("time_spent_minutes") or 0
        sessions.append(d)

    analysis = analyze_sessions(sessions) if sessions else None

    def avg(val):
        return round(val, 2) if val else 0

    # Calculate 30-day stats
    thirty_days_ago = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    recent_sessions = [s for s in sessions if s.get("session_date", "") >= thirty_days_ago] if sessions else []

    total_minutes = sum(s.get("time_spent_minutes", 0) for s in sessions)
    recent_minutes = sum(s.get("time_spent_minutes", 0) for s in recent_sessions)

    unique_days = len(set(s.get("session_date") for s in recent_sessions if s.get("session_date")))
    avg_daily_minutes = recent_minutes // unique_days if unique_days else 0

    mode_counts = analysis["study_modes"] if analysis else {}
    total_mode_count = sum(mode_counts.values()) if mode_counts else 0
    mode_percentages = (
        {k: round((v / total_mode_count) * 100) for k, v in mode_counts.items()} if total_mode_count else {}
    )

    avg_u = avg(analysis["avg_understanding"]) if analysis else 0
    avg_r = avg(analysis["avg_retention"]) if analysis else 0
    avg_p = avg(analysis["avg_performance"]) if analysis else 0
    overall_pct = round(((avg_u + avg_r + avg_p) / 15) * 100, 1) if analysis else 0

    return {
        "counts": {
            "sessions": len(sessions),
            "sessions_30d": len(recent_sessions),
            "topics": len(set(s["topic"] for s in sessions)) if sessions else 0,
            "anki_cards": sum(s.get("anki_cards_count") or 0 for s in sessions),
            "total_minutes": total_minutes,
            "avg_daily_minutes": avg_daily_minutes,
        },
        "range": {
            "first_date": min((s.get("session_date") for s in sessions), default=None),
            "last_date": max((s.get("session_date") for s in sessions), default=None),
        },
        "averages": {
            "understanding": avg_u,
            "retention": avg_r,
            "performance": avg_p,
            "overall": overall_pct,
        },
        "modes": mode_counts,
        "mode_percentages": mode_percentages,
        "frameworks": analysis["frameworks_used"].most_common(5) if analysis else [],
        "recent_topics": analysis["topics_covered"][:10] if analysis else [],
        "weak_areas": analysis["weak_areas"][:5] if analysis else [],
        "strong_areas": analysis["strong_areas"][:5] if analysis else [],
        "what_worked": analysis["what_worked_list"][:3] if analysis else [],
        "common_issues": analysis["common_issues"][:3] if analysis else [],
        "recent_sessions": sessions[:5],
        "thresholds": {"weak": WEAK_THRESHOLD, "strong": STRONG_THRESHOLD},
    }


def get_mastery_stats():
    """
    Get topic mastery statistics for identifying weak areas and relearning needs.
    
    Returns:
        dict with:
        - repeatedly_studied: Topics with highest study_count (potential weak areas)
        - lowest_understanding: Topics with lowest avg_understanding
        - stale_topics: Topics not studied in 14+ days
    """
    import sqlite3
    from db_setup import DB_PATH
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    results = {
        "repeatedly_studied": [],
        "lowest_understanding": [],
        "stale_topics": [],
    }
    
    try:
        # Topics with highest study_count (repeatedly relearned - potential weak areas)
        cursor.execute(
            """
            SELECT topic, study_count, last_studied, first_studied, avg_understanding, avg_retention
            FROM topic_mastery
            WHERE study_count > 1
            ORDER BY study_count DESC
            LIMIT 10
            """
        )
        results["repeatedly_studied"] = [
            {
                "topic": row["topic"],
                "study_count": row["study_count"],
                "last_studied": row["last_studied"],
                "first_studied": row["first_studied"],
                "avg_understanding": round(row["avg_understanding"], 2) if row["avg_understanding"] else None,
                "avg_retention": round(row["avg_retention"], 2) if row["avg_retention"] else None,
            }
            for row in cursor.fetchall()
        ]
        
        # Topics with lowest avg_understanding
        cursor.execute(
            """
            SELECT topic, study_count, last_studied, avg_understanding, avg_retention
            FROM topic_mastery
            WHERE avg_understanding IS NOT NULL
            ORDER BY avg_understanding ASC
            LIMIT 10
            """
        )
        results["lowest_understanding"] = [
            {
                "topic": row["topic"],
                "study_count": row["study_count"],
                "last_studied": row["last_studied"],
                "avg_understanding": round(row["avg_understanding"], 2),
                "avg_retention": round(row["avg_retention"], 2) if row["avg_retention"] else None,
            }
            for row in cursor.fetchall()
        ]
        
        # Topics not studied in 14+ days (getting stale)
        stale_cutoff = (datetime.now() - timedelta(days=14)).strftime("%Y-%m-%d")
        cursor.execute(
            """
            SELECT topic, study_count, last_studied, avg_understanding, avg_retention
            FROM topic_mastery
            WHERE last_studied < ?
            ORDER BY last_studied ASC
            LIMIT 10
            """,
            (stale_cutoff,)
        )
        results["stale_topics"] = [
            {
                "topic": row["topic"],
                "study_count": row["study_count"],
                "last_studied": row["last_studied"],
                "days_since": (datetime.now() - datetime.strptime(row["last_studied"], "%Y-%m-%d")).days if row["last_studied"] else None,
                "avg_understanding": round(row["avg_understanding"], 2) if row["avg_understanding"] else None,
                "avg_retention": round(row["avg_retention"], 2) if row["avg_retention"] else None,
            }
            for row in cursor.fetchall()
        ]
        
    except Exception as e:
        print(f"[WARN] Error fetching mastery stats: {e}")
    finally:
        conn.close()
    
    return results


def get_trend_data(days=30):
    """
    Get trend data for session metrics over time.
    
    Args:
        days: Number of days to look back (default 30)
    
    Returns:
        dict with:
        - dates: List of date strings
        - understanding: Daily average understanding levels
        - retention: Daily average retention confidence
        - session_count: Number of sessions per day
        - duration_avg: Average session duration per day (minutes)
    """
    import sqlite3
    from db_setup import DB_PATH
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    results = {
        "dates": [],
        "understanding": [],
        "retention": [],
        "session_count": [],
        "duration_avg": [],
    }
    
    try:
        cutoff_date = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")
        
        # Query daily aggregates from sessions table
        cursor.execute(
            """
            SELECT 
                session_date,
                COUNT(*) as session_count,
                AVG(understanding_level) as avg_understanding,
                AVG(retention_confidence) as avg_retention,
                AVG(COALESCE(duration_minutes, time_spent_minutes, 0)) as avg_duration
            FROM sessions
            WHERE session_date >= ?
            GROUP BY session_date
            ORDER BY session_date ASC
            """,
            (cutoff_date,)
        )
        
        rows = cursor.fetchall()
        
        for row in rows:
            results["dates"].append(row["session_date"])
            results["understanding"].append(
                round(row["avg_understanding"], 2) if row["avg_understanding"] else None
            )
            results["retention"].append(
                round(row["avg_retention"], 2) if row["avg_retention"] else None
            )
            results["session_count"].append(row["session_count"] or 0)
            results["duration_avg"].append(
                round(row["avg_duration"]) if row["avg_duration"] else 0
            )
    
    except Exception as e:
        print(f"[WARN] Error fetching trend data: {e}")
    finally:
        conn.close()
    
    return results
