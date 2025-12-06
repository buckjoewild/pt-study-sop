# Drawing for Anatomy — Visual Sketch Protocol

## Purpose
Generate simple, clean reference images that the user can sketch from to build spatial understanding of anatomy.

---

## How It Works

When user says "draw" or requests a drawing:

1. **Generate an image** using DALL-E — simple, clean line drawing style
2. **Display the image** for user to reference
3. **Provide sketch instructions** — step-by-step what to draw
4. **Label together** — user adds labels as they draw

---

## Image Generation Prompt Template

When generating anatomy drawings, use this style:

```
Simple black and white line drawing for medical education. 
Clean, minimal style like a textbook diagram. 
White background. 
No shading, no color, just outlines.
[SPECIFIC STRUCTURE] shown from [VIEW/ANGLE].
Key landmarks clearly visible.
Simple and easy to sketch by hand.
```

---

## Example: Rotator Cuff

**User:** "Draw the rotator cuff"

**GPT Action:**
1. Generate image with prompt:
   "Simple black and white line drawing for medical education. Clean, minimal style like a textbook diagram. White background. No shading, no color, just outlines. Posterior view of scapula and humerus showing rotator cuff muscle attachment sites. Key landmarks clearly visible: spine of scapula, acromion, greater tubercle, lesser tubercle. Simple and easy to sketch by hand."

2. Display the image

3. Provide instructions:
   "Here's your reference. Sketch along with me:
   
   **Step 1: Scapula outline**
   - Draw a triangle for the scapula body
   - Add the spine running across horizontally
   - Add the acromion hooking over the top
   
   **Step 2: Humerus**
   - Draw a cylinder coming off laterally
   - Mark the greater tubercle (lateral bump)
   - Mark the lesser tubercle (anterior bump)
   
   **Step 3: Mark attachment sites**
   - Supraspinatus fossa (above spine)
   - Infraspinatus fossa (below spine)  
   - Subscapularis fossa (anterior surface)
   - Teres minor area (lateral border)
   
   **Step 4: Draw muscle lines**
   - Supraspinatus: fossa → greater tubercle (top)
   - Infraspinatus: fossa → greater tubercle (middle)
   - Teres minor: lateral border → greater tubercle (bottom)
   - Subscapularis: anterior scapula → lesser tubercle
   
   **Step 5: Label**
   - Label each muscle
   - Label O and I points
   - Add action arrows if helpful"

---

## Image Style Requirements

**DO:**
- Simple line drawings
- Black on white
- Clear landmarks
- Anatomically accurate but simplified
- Easy to replicate by hand

**DON'T:**
- Photorealistic images
- Complex shading
- Color (unless specifically requested)
- Too much detail
- 3D rendered images

---

## Views to Use

| Structure | Best View |
|-----------|-----------|
| Rotator cuff | Posterior scapula |
| Hip muscles | Posterior pelvis |
| Knee ligaments | Anterior knee, flexed |
| Ankle | Lateral and medial views |
| Spine | Lateral view |
| Brachial plexus | Anterior neck/shoulder |

---

## Workflow

```
User: "draw [structure]"
     ↓
GPT: Generates simple line drawing image
     ↓
GPT: Displays image
     ↓
GPT: "Here's your reference. Sketch along:"
     ↓
GPT: Step-by-step instructions (5-6 steps)
     ↓
User: Sketches while looking at image
     ↓
GPT: "Now label: [list key structures]"
     ↓
User: Adds labels
     ↓
GPT: "What does [structure] do?" (Seed-Lock)
```

---

## Commands

| Command | Action |
|---------|--------|
| `draw [structure]` | Generate image + sketch instructions |
| `another view` | Generate different angle |
| `simpler` | Regenerate with less detail |
| `label` | Get labeling checklist |

---

## Integration with Anatomy Engine

Drawing happens during **M4 Build** phase, after landmarks are mapped:

1. Bones identified ✓
2. Landmarks located ✓
3. **→ Draw the region** (you are here)
4. Attachments mapped on your drawing
5. OIAN layered on
6. Clinical patterns added

The drawing becomes YOUR mental atlas — not a picture you looked at, but one you created.

---

## Key Principle

**You must draw it yourself.** 

The generated image is a REFERENCE, not a replacement. Looking at an image ≠ learning. Sketching it yourself = spatial encoding + memory + ownership.
