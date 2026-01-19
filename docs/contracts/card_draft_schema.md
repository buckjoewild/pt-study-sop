# Card Draft Schema

## Required Fields
- `card_id`
- `session_id`
- `course`
- `topic`
- `card_type` (qna | cloze | image)
- `front`
- `back`

## Optional Fields
- `tags`
- `source`
- `difficulty`
- `variation`

## Rules
- One fact per card.
- Clear cue required.
- Cloze cards: 1–2 deletions max.
