# Diagram Routing

> Decision guide from knowledge source to visual output

---

## 1. Knowledge Source → Diagram Type Mapping

| Knowledge Source | Diagram Type | Recommended Plugin | Question Answered |
|-----------------|--------------|-------------------|-------------------|
| System/service design docs | System architecture diagram | drawio / excalidraw | What does the system look like? |
| API specs / code call chains | Sequence diagram | mermaid / drawio | How do requests flow? |
| Business rules / requirements | Flowchart | mermaid / drawio | How does the business process work? |
| Code (classes/interfaces) | Class diagram | mermaid / drawio | How are objects organized? |
| Database DDL / entity design | ER diagram | mermaid / drawio | How is data stored? |
| Requirements / user stories | Use case diagram | drawio / excalidraw | Who uses the system? |
| Ops config / K8s YAML | Deployment diagram | drawio / excalidraw | How is it deployed? |
| Business state machines | State diagram | mermaid / drawio | How do states transition? |
| Architecture decisions / data integration | Data flow diagram | drawio / excalidraw | Where does data come from and go? |
| Evolution / historical narratives | Timeline diagram | excalidraw / drawio | How did things evolve? |
| Side-by-side comparison | Comparison matrix | excalidraw / drawio | What are the differences? |
| Cause-effect / convergence | Convergence diagram | excalidraw / drawio | What caused this outcome? |
| Classification / concept hierarchy | Taxonomy tree | drawio / mermaid | How is this domain classified? |
| Concept relationships | Concept map | excalidraw / drawio | How do concepts relate? |
| Popular science articles / blog posts | Article illustration | ian-illustrator | How to make abstract ideas intuitive? |
| Concept explanation / cognitive metaphor | Concept illustration | ian-illustrator | How to visualize a mental model? |
| Methodology / tutorial content | Body illustration | ian-illustrator | How to accompany teaching content? |
| General natural language (non-technical architecture) | Article illustration | ian-illustrator | How to add visual appeal to text? |

---

## 2. Confidence Grading Strategy

The AI coding assistant takes different actions based on scenario certainty:

| Scenario | AI Behavior |
|----------|-------------|
| User explicitly specifies diagram type ("draw a sequence diagram") | Execute directly |
| Strong mapping between source and type (DDL → ER diagram) | Execute directly, explain reasoning |
| Source maps to multiple diagram types | Recommend primary + list alternatives, wait for confirmation |
| High-cost format (requires additional toolchain) | Recommend + wait for confirmation |
| External-facing formal document | Recommend + wait for confirmation |

### Decision Principles

- **High certainty** → Execute directly, reduce interaction friction
- **Medium certainty** → Provide recommendation with reasoning, include alternatives
- **Low certainty** → Ask for confirmation, avoid wasting generation cost

---

## 3. Proactive Trigger Signals

When the AI coding assistant detects the following signals in conversation, it should proactively suggest visualization:

| Signal | Explanation |
|--------|-------------|
| Description involves ≥ 3 interacting components | System complexity exceeds text description efficiency |
| Layered/hierarchical structure described | Naturally suits architecture diagrams |
| Temporal descriptions (first… then… after that…) | Suits sequence diagrams or flowcharts |
| Conditional branches (if… else…) | Suits flowcharts or state diagrams |
| User is writing design docs with complex architecture | Diagrams complement document quality |
| Comparative/parallel descriptions | Suits comparison matrix |
| Causal chains | Suits convergence diagrams |
| Content targets non-technical readers (popular science / explanation) | Suits article illustration (ian-illustrator) |
| Need to "draw a cognitive action / metaphor" | Suits concept illustration (ian-illustrator) |
| User mentions "illustration", "article image", "hand-drawn style" | Suits ian-illustrator |

### Suggestion Template

```
Detected that you are describing [signal type]. Suggesting a [diagram type] for visualization.
Recommended format: [format] (reason: [brief explanation])
Would you like me to generate it?
```

---

## 4. Format Selection Guide

### 4.1 Format Comparison

| Feature | Excalidraw | Draw.io | Mermaid | ian-illustrator |
|---------|-----------|---------|---------|-----------------|
| Visual style | Hand-drawn | Polished/formal | Clean text | Artistic hand-drawn (IP character) |
| File format | JSON | XML | Code block | PNG (generated image) |
| Version control friendliness | Medium | Low | High | Low (binary) |
| Editing convenience | VS Code plugin | Dedicated editor | Plain text | Re-generate via prompt |
| Export capability | PNG/SVG | PNG/SVG/PDF | Platform rendering | PNG direct output |
| Complexity ceiling | Medium-High | High | Medium | Single concept / scene |

### 4.2 Scenario Recommendations

| Scenario | Recommended Format | Reason |
|----------|-------------------|--------|
| Internal design docs | Excalidraw | Hand-drawn style, lightweight editing |
| External client deliverables | Draw.io → PNG/SVG | Professional, high-res export |
| README / Git docs | Mermaid | Plain text, version-controlled, platform rendering |
| Presentations / reports | Draw.io → PNG | High-res export, professional styling |
| Quick whiteboard discussion | Excalidraw | Fastest output, approachable style |
| Academic / papers | Draw.io (academic B&W preset) | Publication-compliant |
| Popular science / blog articles | ian-illustrator | Artistic illustration, cognitive metaphor visualization |
| Concept explanation / tutorials | ian-illustrator | Makes abstract ideas tangible with character-driven imagery |

### 4.3 Decision Flow

```
User needs a diagram
  │
  ├─ format_preference defined in design-language.yaml?
  │     ├─ Yes → Use configured format
  │     └─ No  → Continue evaluation
  │
  ├─ Content type?
  │     ├─ Technical engineering (architecture/flow/data) → drawio / excalidraw / mermaid
  │     └─ Popular science / general / concept explanation → ian-illustrator
  │
  ├─ Internal use? → Excalidraw
  ├─ External formal? → Draw.io
  └─ Embedded in docs? → Mermaid
```

---

## 5. Mode Distinction

| Mode | Trigger | Behavior |
|------|---------|----------|
| Create | First generation, no existing diagram | Full generation from knowledge source |
| Edit | Modification of existing diagram | Targeted incremental edit, preserve layout |

### Create Mode Flow

1. Analyze knowledge source → determine diagram type
2. Load corresponding spec + `design-language.yaml`
3. Generate full diagram
4. Self-check → output

### Edit Mode Flow

1. Read existing diagram file
2. Locate modification target
3. Incremental edit (preserve layout, styles, unaffected nodes)
4. Self-check → output
