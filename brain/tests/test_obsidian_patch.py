"""
Tests for Obsidian patch generation.
"""
import os
import tempfile
from pathlib import Path
from obsidian_merge import generate_obsidian_patch


def test_patch_generation_creates_file():
    session_id = "test_session_001"
    note_path = "Test Note.md"
    existing = "# Test Note\n\nExisting content."
    new_content = "New highlight from session."
    
    with tempfile.TemporaryDirectory() as tmpdir:
        os.environ['OBSIDIAN_API_KEY'] = ''
        
        patch_path = generate_obsidian_patch(session_id, note_path, new_content)
        
        if patch_path:
            assert os.path.exists(patch_path)
            assert session_id in patch_path
            assert patch_path.endswith('.diff')


def test_patch_contains_metadata():
    session_id = "test_session_002"
    note_path = "Anatomy/Muscles.md"
    new_content = "Biceps brachii: flexes elbow, supinates forearm."
    
    patch_path = generate_obsidian_patch(session_id, note_path, new_content)
    
    if patch_path and os.path.exists(patch_path):
        with open(patch_path, 'r') as f:
            content = f.read()
        
        assert "# Metadata:" in content
        assert session_id in content
        assert note_path in content
        assert "can_rollback" in content


def test_patch_shows_additions():
    session_id = "test_session_003"
    note_path = "Study Notes.md"
    new_content = "Key point: Origin at supraglenoid tubercle."
    
    patch_path = generate_obsidian_patch(session_id, note_path, new_content)
    
    if patch_path and os.path.exists(patch_path):
        with open(patch_path, 'r') as f:
            content = f.read()
        
        assert "+ " in content or "+" in content


def test_no_patch_for_duplicate_content():
    session_id = "test_session_004"
    note_path = "Duplicate Test.md"
    
    existing = "Same content"
    new_content = "Same content"
    
    patch_path = generate_obsidian_patch(session_id, note_path, new_content, existing_content=existing)
    
    assert patch_path is None


def test_patch_directory_created():
    session_id = "test_session_005"
    note_path = "Test.md"
    new_content = "Content"
    
    patch_dir = Path(__file__).parent.parent / "data" / "obsidian_patches"
    
    generate_obsidian_patch(session_id, note_path, new_content)
    
    assert patch_dir.exists()
    assert patch_dir.is_dir()
