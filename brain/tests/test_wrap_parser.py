import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))
brain_dir = ROOT / "brain"
if str(brain_dir) not in sys.path:
    sys.path.append(str(brain_dir))

from wrap_parser import parse_wrap, is_wrap_format, extract_anki_cards, extract_spaced_schedule


def test_wrap_parser_sections_and_cards():
    wrap_text = """
Section A: Obsidian Notes Pack
Session ID: 2026-01-01_anatomy_brachial-plexus
Date: 2026-01-01
Course: Anatomy
Topic: Brachial Plexus
Mode: Core
Duration: 45
Source-Lock: Gray's

Mistakes & Corrections
- Tutor said the median nerve innervates deltoid (incorrect).
- Formatting was inconsistent.

Section B: Anki Cards
Front: What is the root value of the musculocutaneous nerve?
Back: C5-C7
Tags: anatomy;brachial
Source: Gray's

Front: Which nerve innervates deltoid?
Back: Axillary nerve
Tags: anatomy;shoulder

Section C: Spaced Retrieval
R1: 2026-01-02
R2=2026-01-04
R3 - 2026-01-08

Section D: JSON Logs
```json
{"schema_version":"9.3","date":"2026-01-01","topic":"Brachial Plexus","mode":"Core","duration_min":45}
```
"""

    assert is_wrap_format(wrap_text) is True

    wrap = parse_wrap(wrap_text, use_llm=False)
    assert wrap["section_b"]
    assert len(wrap["section_b"]) == 2
    assert wrap["section_b"][0]["front"].startswith("What is the root value")
    assert wrap["section_c"]["R2"] == "2026-01-04"
    assert wrap["section_d"]["merged"]["topic"] == "Brachial Plexus"
    assert wrap["metadata"]["session_id"] == "2026-01-01_anatomy_brachial-plexus"
    assert len(wrap["tutor_issues"]) == 2


def test_extract_helpers():
    cards_text = """
Front: Q1
Back: A1
Tags: t1;t2
Source: S1

Front: Q2
Back: A2
"""
    schedule_text = """
R1: 2026-01-02
R2=2026-01-05
R4 - 2026-01-22
"""
    cards = extract_anki_cards({"section_b": cards_text})
    schedule = extract_spaced_schedule({"section_c": schedule_text})

    assert len(cards) == 2
    assert cards[0]["front"] == "Q1"
    assert schedule["R4"] == "2026-01-22"
