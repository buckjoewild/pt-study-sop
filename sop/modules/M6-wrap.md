# M6: Wrap — Session Close and Continuity

## Purpose
Close the session properly: review what was learned, create retention tools (cards), and log for the Brain system. Set up next session.

---

## Why Wrap Matters

Without proper wrap:
- No record of what was covered
- Cards generated without user input
- No continuity between sessions
- Missed insights and patterns

With wrap:
- User sees their own anchors
- Cards use user's specific hooks (better retention)
- Brain captures data for analytics
- Clear next steps

---

## Wrap Protocol

### Step 1: Pause and Announce
```
"Session pausing. Let's wrap up."
```

### Step 2: Anchor Review
List all Seeds/hooks the user generated during the session:

```
"Here are your locked anchors from today:

1. [Topic A]: [User's hook/metaphor]
2. [Topic B]: [User's hook/metaphor]
3. [Topic C]: [User's phonetic hook]
4. [Topic D]: [User's metaphor]

These are YOUR words, not mine."
```

### Step 3: Card Selection
User decides which anchors become Anki cards:

```
"Which of these are shaky and need cards? I'll only make cards for the ones you select."
```

**Don't make cards for:**
- Things user feels solid on
- Every single anchor
- AI-generated content user didn't adopt

### Step 4: Card Co-Creation
For each selected anchor, draft a card WITH user input:

```
"Card draft for [Topic A]:

FRONT: [Question]
BACK: [User's specific hook/answer]

Confirm or edit?"
```

**Card principles:**
- Use user's exact words/hooks
- Keep answers concise
- Test retrieval, not recognition
- Include phonetic hooks where applicable

### Step 5: Session Summary
Generate a brief summary for logging:

```
SESSION SUMMARY
--------------
Date: [Today]
Duration: [Approximate time]
Topic: [Main topic]
Mode: [Core/Sprint/Drill]

Buckets Covered:
- [Bucket 1]: [X items encoded]
- [Bucket 2]: [Y items encoded]

Anchors Locked: [Count]
Cards Created: [Count]

Weak Areas Identified:
- [Any gaps or struggles noted]

Next Priority:
- [What to tackle next time]
```

### Step 6: Brain Logging Prompt
```
"To log this session:
1. Copy the template from brain/session_logs/TEMPLATE.md
2. Fill in the session data
3. Save as brain/session_logs/YYYY-MM-DD_[topic].md
4. Run: python brain/ingest_session.py [your file]"
```

---

## Card Creation Rules

### DO Create Cards For:
- Items user selected as "shaky"
- Phonetic hooks user generated
- Key function/mechanism pairs
- Common test question topics

### DON'T Create Cards For:
- Items user says they know well
- Pure definitions without hooks
- Everything just because it was mentioned
- AI-generated metaphors user didn't adopt

### Card Format
```
FRONT: [Retrieval prompt — make them PRODUCE the answer]
BACK: [User's hook + key fact]
```

**Example:**
```
FRONT: What ligament prevents anterior tibial translation? (Think: "A-C-Lock")
BACK: ACL — "Anterior-C-Lock" locks the tibia from sliding forward
```

---

## Session Log Template Reference

The Brain expects this format:

```markdown
# Session Log - YYYY-MM-DD

## Session Info
- Date: YYYY-MM-DD
- Time: HH:MM
- Topic: [Main topic]
- Study Mode: [Core/Sprint/Drill]
- Time Spent: [X] minutes

## Execution Details
- Frameworks Used: [H1, M2, etc.]
- Gated Platter Triggered: [Yes/No]
- WRAP Phase Reached: [Yes/No]
- Anki Cards Created: [Count]

## Ratings
- Understanding Level: [1-5]
- Retention Confidence: [1-5]
- System Performance: [1-5]

## Reflection

### What Worked
[Free text]

### What Needs Fixing
[Free text]

### Notes/Insights
[Free text]
```

---

## Exit Condition
- Anchors reviewed with user
- Selected cards co-created
- Session summary generated
- Next priority identified
- User knows how to log to Brain

---

## Quick Commands

| Command | Action |
|---------|--------|
| `wrap` | Begin wrap sequence |
| `cards` | Jump to card creation |
| `summary` | Generate session summary |
| `log` | Show Brain logging instructions |
