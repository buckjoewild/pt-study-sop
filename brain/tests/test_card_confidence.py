"""
Tests for card draft confidence scoring.
"""
import pytest
from anki_sync import calculate_confidence_score


def test_confidence_with_all_indicators():
    front = "What is the origin of the biceps brachii?"
    back = "The long head originates from the supraglenoid tubercle of the scapula. The short head originates from the coracoid process."
    source_citation = "Gray's Anatomy, Chapter 5"
    
    score = calculate_confidence_score(front, back, source_citation)
    
    assert score >= 0.8, f"Expected high confidence (>=0.8), got {score}"


def test_confidence_with_source_only():
    front = "Test"
    back = "Answer"
    source_citation = "Textbook p.123"
    
    score = calculate_confidence_score(front, back, source_citation)
    
    assert 0.3 <= score < 0.5, f"Expected ~0.3 for source only, got {score}"


def test_confidence_no_source():
    front = "What is the function of the deltoid muscle?"
    back = "The deltoid abducts the arm at the shoulder joint. It has three parts: anterior, middle, and posterior."
    
    score = calculate_confidence_score(front, back, None)
    
    assert 0.5 <= score < 0.8, f"Expected medium confidence without source, got {score}"


def test_confidence_minimal_content():
    front = "Q"
    back = "A"
    
    score = calculate_confidence_score(front, back, None)
    
    assert score < 0.3, f"Expected low confidence for minimal content, got {score}"


def test_confidence_with_specificity():
    front = "What are the attachments of the biceps brachii?"
    back = "Origin: Supraglenoid tubercle (long head), coracoid process (short head). Insertion: Radial tuberosity and bicipital aponeurosis."
    source_citation = "Netter's Atlas"
    
    score = calculate_confidence_score(front, back, source_citation)
    
    assert score >= 0.9, f"Expected very high confidence with all indicators, got {score}"


def test_confidence_question_mark_bonus():
    front = "What is the innervation?"
    back = "Musculocutaneous nerve (C5-C7)"
    
    score_with_q = calculate_confidence_score(front, back, None)
    
    front_no_q = "Innervation"
    score_without_q = calculate_confidence_score(front_no_q, back, None)
    
    assert score_with_q > score_without_q, "Question mark should increase score"


def test_confidence_multiple_sentences_bonus():
    front = "Describe the biceps brachii"
    back_single = "It flexes the elbow"
    back_multiple = "It flexes the elbow. It also supinates the forearm."
    
    score_single = calculate_confidence_score(front, back_single, None)
    score_multiple = calculate_confidence_score(front, back_multiple, None)
    
    assert score_multiple > score_single, "Multiple sentences should increase score"


def test_confidence_score_bounds():
    front = "?" * 100
    back = "." * 1000
    source_citation = "Source"
    
    score = calculate_confidence_score(front, back, source_citation)
    
    assert 0.0 <= score <= 1.0, f"Score must be between 0 and 1, got {score}"
