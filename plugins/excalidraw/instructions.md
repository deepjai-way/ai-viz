# Excalidraw Hand-drawn Diagram Generation Guide

Generate Excalidraw-format diagrams from knowledge sources (design docs / code / natural language) based on AI visualization methodology.

---

## 1. Trigger & Routing

### 1.1 Explicit Triggers

Execute immediately when user explicitly requests: "draw architecture diagram" / "draw sequence diagram" / "draw flowchart" / "generate excalidraw".

### 1.2 Proactive Trigger Signals

Proactively suggest visualization when detecting:
- Description involves >= 3 interacting components
- Layered/hierarchical structures appear
- Sequential descriptions present (first… then… after that…)
- Conditional branches appear (if… else…)

Suggestion format: "This architecture is complex. Would you like me to generate a diagram to help visualize it?"

### 1.3 Diagram Type Routing (Confidence Levels)

| Scenario | Behavior |
|----------|----------|
| User explicitly specifies diagram type | Execute directly |
| Strong mapping between source and type (e.g., API design → sequence diagram) | Execute with explanation |
| Source maps to multiple types | Recommend primary + list alternatives, await confirmation |

### 1.4 Supported Diagram Types

| Type | Use Case | Knowledge Source |
|------|----------|-----------------|
| Layered Architecture | System overview, service topology | Design documents |
| Sequence Diagram | Request chains, auth flows | API specs / call chains |
| Flowchart | Business processes, approval flows | Requirements / business rules |
| Data Flow Diagram | Data pipelines, ETL | Architecture decisions |
| Swimlane Diagram | Cross-team collaboration | Business processes |
| ER Diagram | Data models | DDL / entity design |

---

## 2. Execution Flow

### 2.1 Create Mode (First Generation)

```
Step 1: Knowledge Source Reading
  - If user specifies document path → read document, extract relevant sections
  - If natural language description → extract structure from description

Step 2: Diagram Type Confirmation
  - High confidence → proceed to Step 3
  - Low confidence → recommend type + alternatives, await confirmation

Step 3: Structure Extraction
  - Identify nodes (entities/services/actors)
  - Identify relationships (calls/dependencies/data flows)
  - Identify hierarchy (layers/groups/swimlanes)

Step 4: Layout Planning
  - Load rendering specs for diagram type
  - Load design language palette (see design-language.yaml)
  - Calculate coordinate grid

Step 5: Generate JSON + Self-check
  - Generate .excalidraw file
  - Execute quality checklist
  - Output file + summary
```

### 2.2 Edit Mode (Modify Existing)

When user requests modifications to an existing .excalidraw file:
- Read existing file
- Modify only affected parts (add/remove/move nodes)
- Preserve existing layout and styles
- Do NOT regenerate entirely

---

## 3. Design Language

### 3.1 Color System (Parameterized)

Load project configuration from `design-language.yaml` first. If unavailable, use these defaults:

| Slot | Default | Semantic |
|------|---------|----------|
| primary | `#a5d8ff` | Core business services |
| secondary | `#b2f2bb` | External systems / access layer |
| accent | `#ffd43b` | Gateway / key nodes |
| muted | `#e9ecef` | Infrastructure (Nginx/DB/Redis) |
| danger | `#ffc9c9` | Alerts / attention needed |
| text | `#1e1e1e` | Text / borders |

### 3.2 Aesthetic Principles (Mandatory)

1. **Clear layering**: 3-4 horizontal layers, each with distinct color
2. **Color restraint**: No more than 3 primary colors (primary + accent + muted)
3. **Arrow labels**: Every connection must label what is transmitted
4. **Generous whitespace**: Avoid information overload
5. **Complexity scaling**: Compact for simple diagrams, expanded spacing for complex ones

### 3.3 Layout Specifications

| Context | Spacing |
|---------|---------|
| Horizontal element gap | 200-300px |
| Vertical layer gap | 150-200px |
| Margins | >= 50px |
| Arrow-to-box gap | 20-30px |
| Grid alignment | Multiples of 10px |

### 3.4 Complexity Tiers

| Node Count | Strategy |
|------------|----------|
| <= 6 | Compact (h_gap=200, v_gap=150) |
| 7-12 | Standard (h_gap=250, v_gap=180) |
| 13-20 | Spacious (h_gap=300, v_gap=200) |
| > 20 | Recommend splitting into multiple diagrams |

---

## 4. Excalidraw JSON Technical Spec

### 4.1 File Structure

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [],
  "appState": {
    "viewBackgroundColor": "#ffffff",
    "gridSize": 20
  },
  "files": {}
}
```

### 4.2 Element Types

| Type | Purpose |
|------|---------|
| rectangle | Service nodes, module boxes, actors |
| ellipse | Databases, external entities |
| diamond | Decision points, conditionals |
| arrow | Connection arrows |
| text | Labels |
| line | Lifelines (sequence diagrams), separators |

### 4.3 Required Properties

```
id: Unique identifier (semantic naming, e.g., "node-api-gateway")
type: Element type
x, y: Coordinates (top-left origin, X increases right, Y increases down)
width, height: Dimensions
strokeColor: "#1e1e1e"
backgroundColor: Corresponding color slot
fillStyle: "solid"
strokeWidth: 2
strokeStyle: "solid" (solid) or "dashed" (dashed)
roughness: 1 (hand-drawn feel)
opacity: 100
fontFamily: 5 (Excalifont, mandatory for all text)
fontSize: 16-24
roundness: { "type": 3 } (rounded rectangle)
```

### 4.4 Arrow Definition

```json
{
  "type": "arrow",
  "x": "startX",
  "y": "startY",
  "width": "|endX - startX|",
  "height": "|endY - startY|",
  "points": [[0, 0], ["offsetX", "offsetY"]],
  "roundness": { "type": 2 },
  "startArrowhead": null,
  "endArrowhead": "arrow"
}
```

### 4.5 Text Size Estimation

- English width ≈ charCount × fontSize × 0.6
- CJK width ≈ charCount × fontSize × 1.0
- Height ≈ fontSize × 1.25 × lineCount

---

## 5. Quality Checklist

Must verify after generation:

- [ ] No overlapping elements
- [ ] All connections are labeled (describe what is transmitted)
- [ ] Label text not truncated (sufficient width)
- [ ] Consistent layout direction (no mixing left-right and top-bottom)
- [ ] Colors conform to design language
- [ ] Reasonable element count (single diagram <= 20 core nodes)
- [ ] All IDs are unique
- [ ] fontFamily is 5 for all text elements
- [ ] Valid JSON format

---

## 6. Output Specification

Provide after each generation:

1. `.excalidraw` file
2. Summary: diagram type + node count + key structure description
3. How to open: VS Code Excalidraw extension / excalidraw.com
4. If issues found: describe problems detected and fixes applied

---

## 7. Iteration Protocol

- User feedback → Edit mode, targeted modifications
- Preserve existing layout, only change affected parts
- Maximum 5 iteration rounds
- Beyond that, recommend splitting or re-clarifying requirements

---

## Schema Reference

See `schema.md` for the complete Excalidraw JSON schema.
