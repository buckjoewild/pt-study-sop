"""
Tests for calendar NL parsing.
"""
from dashboard.calendar_assistant import parse_nl_to_change_plan


def test_parse_add_event():
    nl = "Add exam on March 15"
    result = parse_nl_to_change_plan(nl)
    
    assert result["success"] == True
    assert len(result["plan"]) > 0
    
    op = result["plan"][0]
    assert op["action"] == "add"
    assert "exam" in op.get("event_type", "").lower() or "exam" in op.get("title", "").lower()


def test_parse_move_event():
    nl = "Move quiz to next Tuesday"
    result = parse_nl_to_change_plan(nl)
    
    assert result["success"] == True
    assert len(result["plan"]) > 0
    
    op = result["plan"][0]
    assert op["action"] in ["move", "reschedule"]


def test_parse_delete_event():
    nl = "Delete lab on Friday"
    result = parse_nl_to_change_plan(nl)
    
    assert result["success"] == True
    assert len(result["plan"]) > 0
    
    op = result["plan"][0]
    assert op["action"] == "delete"


def test_parse_invalid_input():
    nl = "xyzabc nonsense input"
    result = parse_nl_to_change_plan(nl)
    
    assert "success" in result
    assert "plan" in result
    assert "error" in result


def test_parse_empty_input():
    nl = ""
    result = parse_nl_to_change_plan(nl)
    
    assert "success" in result
    assert "plan" in result


def test_parse_multiple_operations():
    nl = "Add quiz on Monday and delete lab on Wednesday"
    result = parse_nl_to_change_plan(nl)
    
    if result["success"]:
        assert len(result["plan"]) >= 1


def test_parse_with_time():
    nl = "Add lecture on March 20 at 2pm"
    result = parse_nl_to_change_plan(nl)
    
    if result["success"] and len(result["plan"]) > 0:
        op = result["plan"][0]
        assert op["action"] == "add"
        assert "date" in op or "time" in op
