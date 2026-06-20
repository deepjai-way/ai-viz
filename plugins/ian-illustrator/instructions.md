# Ian Xiaohei Article Illustration Generation Instructions

Generate quirky, hand-drawn 16:9 article illustrations featuring the Xiaohei IP character. The goal is not commercial illustration, PPT infographics, or cute cartoons — it's turning key judgments, processes, structures, states, or metaphors from articles into clean, absurd, creative, readable hand-drawn explanatory sketches.

---

## 1. Overview

This plugin generates PNG illustrations for Chinese articles, blog posts, documentation, and content pieces. Each illustration:

- Features "Xiaohei" (小黑) as the core action character
- Uses a pure white background with minimalist black hand-drawn line art
- Includes sparse red/orange/blue handwritten Chinese annotations
- Communicates one core structure per image
- Targets a quirky product-sketch aesthetic, not formal diagrams

---

## 2. Workflow

### 2.1 Digest the Article

Read the source content (article, Markdown, Notion page, or provided text). Extract:

- What is the core argument
- Which paragraphs carry cognitive turning points
- Which content benefits from visual explanation
- Which parts are better left as text only

Do not distribute illustrations evenly. Prioritize "cognitive anchors": core judgments, breakpoints, input-output loops, branching, before-after comparisons, one-source-many-uses, handoff paths, common pitfalls, role state changes.

### 2.2 Shot List (Illustration Strategy)

If the user requests analysis of where illustrations should go, produce a shot list. For each image specify:

- **Insertion position**: after which paragraph (quote the first few characters of that paragraph as an anchor)
- Image theme
- Core meaning
- Structure type
- What Xiaohei does in the image
- Suggested elements
- Suggested Chinese annotation words

Shot list format example:

```
Shot 1:
- Theme: xxx
- Insertion position: after paragraph N (anchor: "开头几个字...")
- Core meaning: xxx
- Structure type: xxx
- Xiaohei action: xxx
- Suggested elements: xxx
- Suggested annotations: xxx
```

Default 4–8 images. Short articles: 1–3. Long articles: do not exceed 9. Enough is enough — avoid turning prose into a picture book.

### 2.3 Generate Individual Images

When the user explicitly requests generation, produce each image individually using image generation. Never combine multiple illustrations into one image.

Each image must follow:

- 16:9 horizontal Chinese article illustration
- Pure white background
- Black hand-drawn line art
- Sparse red/orange/blue handwritten Chinese annotations
- Generous white space
- Xiaohei as the core action subject
- **Prohibited**: PPT style, commercial illustration, childish/cute, complex architecture, type-title in top-left corner

Do not replicate past examples. Invent a fresh, strange-but-logical metaphor for the current article every time.

### 2.4 QA & Iteration

After generation, check against [Reference: qa-checklist.md]. Regenerate or locally edit if:

- Xiaohei is merely decorative
- Canvas is too crowded
- Looks like a flowchart/PPT
- Too many or illegible Chinese labels
- Top-left corner contains a type title
- Style is too cute, childish, or rigid
- Background is not clean white

### 2.5 Save & Deliver

Save final images to an `illustrations/` subdirectory alongside the article:

```text
article.md
illustrations/
  01-topic-name.png
  02-topic-name.png
```

Naming convention: `NN-topic-name.png` (sequential number + short topic in English or pinyin).

Preserve original generated files. Do not overwrite existing assets unless the user explicitly requests replacement.

### 2.6 Auto-Insert into Article

After saving images, automatically insert image references into the article at the positions specified in the shot list. This is the **default behavior**.

#### Insertion Format

Insert standard Markdown image references:

```markdown
![图片描述](./illustrations/01-topic-name.png)
```

- Image description uses a short Chinese caption (derived from the shot list theme)
- Use relative paths for portability

#### Insertion Logic

1. Locate the target paragraph using the anchor text from the shot list
2. Insert a blank line + image reference + blank line **after** the target paragraph
3. Process images in order (Shot 1 first, then Shot 2, etc.) to avoid position drift
4. Do not modify any existing content in the article — only add image reference lines

#### Safety Rules

- Confirm the article file path is correct before inserting
- Never alter, delete, or rewrite any original article content
- If the exact insertion position cannot be determined, append a comment after the image reference:
  ```markdown
  ![描述](./illustrations/01-topic.png)
  <!-- ai-viz: suggested placement after paragraph "xxx..." -->
  ```
- If the article file is not found or path is ambiguous, ask the user before proceeding

#### Output Confirmation

After insertion, output a change summary:

```
✅ Inserted N illustrations into article.md:
- After paragraph X: 01-topic.png (theme description)
- After paragraph Y: 02-topic.png (theme description)
```

### 2.7 Behavior Control

Auto-insert is the default. Users can override via prompt:

| User says | Behavior |
|-----------|----------|
| _(default, no special instruction)_ | Generate images + auto-insert into article |
| "don't insert" / "先不要插入" | Generate images only, do not modify article |
| "shot list only" / "只出 shot list" | Only produce the shot list, do not generate images |

---

## 3. Structure Types

Choose one structure type per image. Do not mix multiple types.

| Type | Best For | Composition Approach |
|------|----------|---------------------|
| **Workflow** | Input→Process→Output, content production, AI workflows | Left input, middle processing (Xiaohei or strange machine), right output, orange arrows for flow |
| **System Partial** | Info sources, filters, databases, agent subsystems | Only 3–5 core modules, Xiaohei performs one key action |
| **Before-After Comparison** | Chaos/order, manual/auto, scattered/converged | Left chaotic, right stable, orange arrow in middle |
| **Role State** | User pain points, creator states, tool overload | 2–4 small states, each with a short annotation |
| **Concept Metaphor** | Content factory, info warehouse, brain black-box | One large strange object or machine, few inputs, one output |
| **Layered Method** | Methodology frameworks, capability stacks | Stacked boxes (not formal pyramids), Xiaohei building beside |
| **Route Map** | Idea-to-launch, user journey, learning path | One curved path, few nodes, Xiaohei walking or leading |
| **Comic Panels** | Failure-to-success, real process, before/after | 2–4 small scenes, one action per panel |

---

## 4. Visual Style

### 4.1 Core DNA

Pure white, minimalist, hand-drawn, generous whitespace, restrained, quirky, product-sketch feeling, Chinese handwriting feel, structurally clear but not instructional.

Like a sketch an AI/product/design person casually drew on white paper to explain something.

### 4.2 Mandatory Rules

- 16:9 horizontal format
- Pure white background (no beige, warm gray, paper texture, gradients, shadows, noise)
- Black hand-drawn line art: thin lines, slight wobble, not mechanical, not vector, not thick outlines
- Main subject occupies ~40–60% of canvas, at least 35% blank white space
- Sparse Chinese handwritten annotations: max 5–8 per image, each 2–8 characters
- One image = one core action, structure, state, or metaphor
- Do not write the structure type name on the image

### 4.3 Color System

| Color | Usage |
|-------|-------|
| Black | Main line art, characters, frames, structures, primary text, objects |
| Red | Key annotations, problems, emotional points, warnings, results |
| Orange | Main flow, paths, arrows, automation direction, A→B movement |
| Blue | Supplementary notes, mental states, system states, secondary explanations |

Blue is not required in every image. Use color sparingly — less is more.

### 4.4 Absolute Don'ts

- No commercial illustration
- No PPT infographics
- No formal flowcharts
- No course slides
- No cute cartoon posters
- No children's illustration
- No complex architecture diagrams
- No polished flat illustrations
- No tech UI aesthetic
- No real app screenshots
- No complex backgrounds, gradients, shadows, textures
- No explaining every node
- No type-title in top-left corner

---

## 5. Xiaohei IP Character

### 5.1 Definition

Xiaohei is the fixed visual IP. Every image must include Xiaohei. Xiaohei is not a mascot, sticker, or cute decoration — it's a serious participant in the system's absurd operation.

### 5.2 Appearance

- Solid black small creature
- White dot eyes
- Thin legs, occasionally thin arms
- Body can be: cylinder, black bean, black box, funnel, shadow, hole opening, internal machine block
- Slightly irregular outline with hand-drawn feel
- Expression: blank, dazed, calm, serious

### 5.3 Personality

- Very serious, but doing something slightly absurd
- Like a low-key system operator
- Dry humor, never cute
- Slightly clumsy, but not stupid
- Like it actually has a job in a whiteboard sketch

### 5.4 Core Rule

Xiaohei must perform the core conceptual action, not decorate the scene. If removing Xiaohei doesn't change the image's meaning, Xiaohei is too decorative — rewrite the prompt to make Xiaohei the action subject.

### 5.5 Prohibited

- Do not make Xiaohei an overly cute mascot
- Do not draw as children's cartoon character
- Do not add complex clothing, emoji expressions, or shiny eyes
- Do not let Xiaohei just stand in a corner watching
- Do not let Xiaohei overshadow the structural expression
- Do not make Xiaohei too commercial, too rounded, or too polished

---

## 6. Original Metaphor Generation

### 6.1 Three-Step Method

1. Replace abstract concept with a physical action: stuck, leaked, heavy, sorting, sedimenting, fermenting, opening, folding, unpacking, reflowing
2. Replace system structure with a low-tech object: broken machine, cardboard box, drawer, pipe, mailbox, strange gauge, scale, well, ladder, weird workstation
3. Make Xiaohei perform the action: not standing beside, but stuck in the machine, pulling the wrong wire, guarding a gate, hauling, patching, weighing, holding a ladder, recording, stuffing things into a strange device

### 6.2 Anti-Replication Rule

Never default to or replicate previous example compositions. Examples are only for style calibration (line density, whitespace, color restraint, Xiaohei's vibe).

Unless the user explicitly says "replicate this one / use this composition / modify this example," always invent a new metaphor for the same topic.

---

## 7. Output Specification

### 7.1 Format

- PNG, 16:9 horizontal
- 4–8 images per article (adjustable based on length)

### 7.2 Delivery Summary

After generation, provide:

- Number of images generated
- Each image's purpose and placement
- Save path
- Which images are strongest, which are optional

Keep delivery notes brief. Let the images speak for themselves.

---

## 8. References

Load on demand — do not read all at once:

- [Reference: style-dna.md] — Style DNA, colors, text rules, prohibitions
- [Reference: xiaohei-ip.md] — Xiaohei IP appearance, personality, action library, prohibitions
- [Reference: composition-patterns.md] — Structure types, original metaphor method, anti-replication rules
- [Reference: prompt-template.md] — Single-image generation prompt template
- [Reference: qa-checklist.md] — Post-generation QA checklist and iteration rules
