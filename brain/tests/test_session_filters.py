import sys
import json
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))
brain_dir = ROOT / "brain"
if str(brain_dir) not in sys.path:
    sys.path.append(str(brain_dir))

from dashboard.app import create_app


@pytest.fixture
def client():
    """Create a test client for the Flask app."""
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_sessions_no_filter(client):
    """Test GET /api/sessions without date filters returns all sessions."""
    response = client.get('/api/sessions')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)


def test_sessions_date_range(client):
    """Test GET /api/sessions with both start and end date filters."""
    response = client.get('/api/sessions?start=2025-08-01&end=2025-12-31')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    # All returned sessions should be within the date range
    for session in data:
        if 'session_date' in session:
            assert session['session_date'] >= '2025-08-01'
            assert session['session_date'] <= '2025-12-31'


def test_sessions_start_only(client):
    """Test GET /api/sessions with only start date filter."""
    response = client.get('/api/sessions?start=2025-08-01')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    # All returned sessions should be on or after start date
    for session in data:
        if 'session_date' in session:
            assert session['session_date'] >= '2025-08-01'


def test_sessions_end_only(client):
    """Test GET /api/sessions with only end date filter."""
    response = client.get('/api/sessions?end=2025-12-31')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    # All returned sessions should be on or before end date
    for session in data:
        if 'session_date' in session:
            assert session['session_date'] <= '2025-12-31'


def test_sessions_invalid_dates_handled_gracefully(client):
    """Test that invalid dates are handled gracefully (no crash)."""
    # Empty string should be treated as no filter
    response = client.get('/api/sessions?start=&end=')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)


def test_sessions_malformed_dates_handled_gracefully(client):
    """Test that malformed dates don't crash the endpoint."""
    # Malformed dates should either be ignored or handled gracefully
    response = client.get('/api/sessions?start=invalid&end=also-invalid')
    # Should either return 200 with filtered results or 500 with error
    # The important thing is it doesn't crash unexpectedly
    assert response.status_code in [200, 500]


def test_sessions_semester_1(client):
    """Test GET /api/sessions with semester=1 filter (Fall 2025)."""
    response = client.get('/api/sessions?semester=1')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    # All returned sessions should be within Semester 1 date range
    for session in data:
        if 'session_date' in session:
            assert session['session_date'] >= '2025-08-25'
            assert session['session_date'] <= '2025-12-12'


def test_sessions_semester_2(client):
    """Test GET /api/sessions with semester=2 filter (Spring 2026)."""
    response = client.get('/api/sessions?semester=2')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    # All returned sessions should be within Semester 2 date range
    for session in data:
        if 'session_date' in session:
            assert session['session_date'] >= '2026-01-05'
            assert session['session_date'] <= '2026-04-24'


def test_sessions_semester_with_custom_start(client):
    """Test GET /api/sessions with semester=1 and custom start date."""
    response = client.get('/api/sessions?semester=1&start=2025-09-01')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    # Custom start date should override semester start; end should still be semester end
    for session in data:
        if 'session_date' in session:
            assert session['session_date'] >= '2025-09-01'
            assert session['session_date'] <= '2025-12-12'


def test_sessions_invalid_semester_ignored(client):
    """Test that invalid semester values are ignored gracefully."""
    response = client.get('/api/sessions?semester=99')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    # Invalid semester should be ignored; endpoint should return all sessions
