# Quality Control

> Quality assurance system for diagram generation and iteration

---

## 1. Universal Self-Check Checklist

After generating any diagram, the AI coding assistant should verify each item:

### Structural Completeness

- [ ] All core entities mentioned in the knowledge source are represented
- [ ] Relationships between entities are complete, no critical connections missing
- [ ] Diagram type matches the knowledge source (correct type selected)

### Layout Quality

- [ ] No overlapping elements
- [ ] Consistent layout direction (no mixing of left-right and top-bottom)
- [ ] Uniform element spacing with sufficient whitespace
- [ ] Clear layering/grouping logic

### Label Standards

- [ ] All connectors are labeled (indicating what is transmitted or relationship type)
- [ ] Label text is not truncated, fully readable
- [ ] Consistent node naming (same entity uses same name throughout)

### Visual Standards

- [ ] Colors conform to `design-language.yaml` definitions
- [ ] Reasonable element count (no more than 20 core nodes per diagram)
- [ ] Clear font size hierarchy (title > body > caption)

---

## 2. Format-Specific Checks

### Excalidraw

| Check Item | Description |
|------------|-------------|
| JSON validity | File can be correctly parsed by JSON parser |
| ID uniqueness | All element IDs are unique |
| Font settings | fontFamily matches design-language.yaml |
| Binding relationships | Arrow startBinding/endBinding point to correct elements |
| Group integrity | groupIds are correctly associated, no orphan group references |
| Coordinate sanity | Elements within reasonable canvas bounds, no negative coordinate overflow |

### Draw.io

| Check Item | Description |
|------------|-------------|
| XML tag closure | Document structure complete, tags properly nested |
| mxCell ID uniqueness | All cell IDs are unique |
| Special character escaping | &, <, >, " properly escaped |
| Connector endpoints | source/target reference existing IDs |
| Style completeness | style attribute contains necessary visual parameters |
| Parent-child relationships | parent attribute points to correct container |

### Mermaid

| Check Item | Description |
|------------|-------------|
| Syntax correctness | Can be parsed by Mermaid renderer |
| Valid node IDs | No special characters causing parse failures |
| Direction declaration | graph/flowchart direction matches content |
| Subgraph nesting | subgraph blocks properly closed |
| Label escaping | Labels with special characters wrapped in quotes |

---

## 3. Iteration Protocol

### 3.1 Core Principles

- User feedback → targeted edit (Edit mode), not full regeneration
- Each edit preserves existing layout, only modifying affected parts
- Keep changes traceable (inform user what was changed)

### 3.2 Iteration Constraints

| Rule | Description |
|------|-------------|
| Minimal change principle | Only modify issues pointed out by user, don't adjust other parts |
| Layout stability | Unaffected nodes retain original position and style |
| Iteration limit | Maximum 5 rounds per diagram; beyond that, suggest splitting or re-scoping |
| Change confirmation | Explain modifications after each round |

### 3.3 When to Regenerate

Abandon Edit mode and restart from Create mode when:

- Requirements changed by more than 50% (most nodes need adjustment)
- Diagram type needs to change (e.g., flowchart → sequence diagram)
- Fundamental layout structure change (e.g., 3 layers → 5 layers)
- More than 5 iterations without convergence

---

## 4. Aesthetic Principles

### 4.1 Clear Layering

- Divide horizontally into 3-4 layers, each with its own color scheme
- Clearly distinguish layers with spacing or separators
- Information flow direction aligns with layer direction

### 4.2 Color Restraint

- No more than 3 dominant colors (primary + accent + muted)
- Same semantic = same color throughout the diagram
- High contrast ensures readability (especially text vs. background)

### 4.3 Arrow Labels

- Every connector indicates what is being transmitted
- Arrow direction matches data/control flow direction
- Bidirectional relationships use double-headed arrows or two unidirectional lines

### 4.4 Generous Whitespace

- Avoid information overload; maintain sufficient spacing between elements
- More whitespace around important elements creates visual focus
- Reserve margins at diagram edges

### 4.5 Complexity Management

| Complexity | Node Count | Strategy |
|------------|-----------|----------|
| Simple | ≤ 8 | Compact layout, single area |
| Medium | 9-15 | Grouped layout, 2-3 logical zones |
| Complex | 16-20 | Layered layout, extended routing corridors |
| Very Complex | > 20 | Split into multiple diagrams, each focusing on a subsystem |

### 4.6 Consistency

- Same type of elements use identical shapes and sizes
- Unified font styles within a single diagram
- Grid-aligned spacing and alignment
