# AI Visualization Methodology

> Version: 1.0  
> Scope: Universal Core (Tool-Agnostic)

---

## 1. Core Principles

### 1.1 Knowledge Source First

Diagrams are not the goal — visual representation of knowledge is. The source is design documents, code, and DDL; diagrams are views. Don't invent new formats or maintain separate "architecture description files" — the design document itself is the best source.

### 1.2 Diagram Types Are Projections of the Same Knowledge

The same architectural knowledge can be rendered as an architecture diagram (structural view), a sequence diagram (behavioral view), or a deployment diagram (operations view). The choice depends on what question needs to be answered.

### 1.3 AI Is a Translator, Not a Canvas

The value of AI is not "you tell it where to place each node," but rather extracting structure from unstructured knowledge, selecting the most appropriate visual expression, and rendering according to specifications.

### 1.4 Format Agnosticism

Whether the output is Excalidraw, Draw.io, or Mermaid, the methodology makes no distinction. Format is the last decision, determined by audience, use case, and version control needs.

---

## 2. Layered Architecture

```
┌──────────────────────────────────────────────────┐
│           Methodology Layer (this document)        │
│                                                    │
│  · Knowledge source conventions                    │
│  · Diagram routing (confidence + proactive trigger)│
│  · Rendering specs (specs/)                        │
│  · Design language (project-level injection)       │
│  · Mode distinction (Create vs Edit)              │
└────────────────────────┬─────────────────────────┘
                         │
           ┌─────────────┼─────────────┐
           ▼             ▼             ▼
   ┌─────────────┐ ┌──────────┐ ┌──────────┐
   │  Draw.io    │ │Excalidraw│ │ Mermaid  │
   │  Plugin     │ │  Plugin  │ │ (text)   │
   │ (polished)  │ │(sketched)│ │          │
   └─────────────┘ └──────────┘ └──────────┘
```

### Responsibility Boundaries

| Responsibility | Methodology Layer | Plugin Layer |
|----------------|-------------------|--------------|
| Decide what diagram to draw | ✅ | |
| Decide which format to use | ✅ | |
| Define design language | ✅ | |
| Generate formatted output (XML/JSON/code) | | ✅ |
| Self-check quality | | ✅ |
| Iterative editing | | ✅ |
| Export files | | ✅ |

---

## 3. Mode Distinction

| Mode | Trigger | Behavior |
|------|---------|----------|
| Create | First generation, no existing diagram | Full generation from knowledge source |
| Edit | Modification of existing diagram | Targeted incremental edit, preserve layout |

- **Create Mode**: AI extracts structure from the knowledge source, selects diagram type and format, and generates the full output per rendering specs.
- **Edit Mode**: AI locates the modification target and makes minimal changes while preserving existing layout.

---

## 4. Design Language Injection

The methodology is universal, but each project has its own visual style. This is injected via a project-level `design-language.yaml` configuration.

### 4.1 Configuration Format

```yaml
# design-language.yaml — Project design language configuration
project: "Project Name"

colors:
  primary: "#a5d8ff"       # Primary elements (core services/nodes)
  secondary: "#b2f2bb"     # Secondary elements (external systems/auxiliary)
  accent: "#ffd43b"        # Emphasis (gateways/critical paths)
  muted: "#e9ecef"         # De-emphasized (infrastructure/background)
  danger: "#ffc9c9"        # Alerts/errors
  text: "#1e1e1e"          # Text/borders

typography:
  font_family: "default"
  font_size_title: 24
  font_size_body: 16
  font_size_caption: 12

layout:
  direction: "top-to-bottom"
  grid_size: 10
  h_gap: 250
  v_gap: 180
  margin: 50

format_preference:
  internal: "excalidraw"       # Default for internal docs
  external: "drawio"           # Default for external docs
  documentation: "mermaid"     # Default for README/docs

style_preset: "handdrawn"
```

### 4.2 Onboarding a New Project

1. Copy the `design-language.yaml` template into the project
2. Fill in project colors and preferences
3. Start using — the AI coding assistant reads the config and renders in the project's style

---

## 5. Rendering Spec System (specs/)

### 5.1 Organization Principles

- Organized by **knowledge domain**, not output format
- **Write on demand** — don't pre-build empty scaffolds
- Each spec is a persistent design standard, not a one-time prompt

### 5.2 Directory Structure

```
specs/
├── architecture/          # Architecture
│   ├── layered.md         # Layered architecture
│   ├── microservice.md    # Microservice topology
│   └── domain.md          # Domain boundaries
├── behavior/              # Behavior
│   ├── sequence.md        # Sequence diagrams
│   ├── flowchart.md       # Flowcharts
│   └── state.md           # State diagrams
├── data/                  # Data
│   ├── er.md              # ER diagrams
│   └── dataflow.md        # Data flow diagrams
├── concept/               # Concept / Thinking
│   ├── timeline.md        # Timeline / evolution
│   ├── comparison.md      # Comparison matrix
│   └── convergence.md     # Convergence / radial
└── style-presets/         # Style presets
    ├── academic-bw.md     # Academic B&W
    ├── corporate.md       # Corporate
    └── handdrawn.md       # Hand-drawn
```

### 5.3 Required Fields Per Spec

```markdown
# {Diagram Type} Rendering Spec

## Applicable Scenarios
When to use this diagram type; what knowledge sources are suitable.

## Layout Standards
- Direction (top-to-bottom / left-to-right)
- Recommended canvas size
- Element spacing
- Complexity grading rules

## Color Standards
- Use color slots from design-language.yaml (primary / secondary / accent / muted)
- Semantic mapping (e.g., service=primary, database=muted, gateway=accent)

## Element Standards
- Node shape selection
- Connector styles (solid/dashed/arrow types)
- Label requirements (connectors must indicate what is transmitted)

## Minimal Complete Example
A skeleton-level example structure (no specific business content).
```

---

## 6. Glossary

| Term | Definition |
|------|-----------|
| Knowledge Source | The origin of diagram information (design docs, code, DDL, etc.) |
| Diagram Type | The category of diagram (architecture, sequence, flowchart, etc.) |
| Rendering Spec | Design standards for a specific diagram type (layout, color, elements, labels) |
| Design Language | Project-level visual style definition (colors, typography, spacing), carried by `design-language.yaml` |
| Style Preset | A predefined visual style template (academic, corporate, hand-drawn) |
| Create Mode | Full generation of a new diagram from knowledge source |
| Edit Mode | Targeted incremental modification of an existing diagram |
