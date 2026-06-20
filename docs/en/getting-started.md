# Getting Started

This guide walks you through installing ai-viz and generating your first diagram.

## Prerequisites

- **Node.js** >= 18.0.0
- An AI coding tool (Claude Code, Cursor, Windsurf, OpenCode, GitHub Copilot, Qoder, or Aider)
- (Optional) [Draw.io Desktop](https://github.com/jgraph/drawio-desktop) — required for PNG/SVG/PDF export

## Installation

ai-viz uses an interactive CLI wizard. No global install needed:

```bash
cd your-project
npx ai-viz init
```

### Step-by-Step Walkthrough

```
🎨 AI-Viz Initialization Wizard
────────────────────────────────────────

? Select your AI coding tool:
  ❯ Claude Code
    Cursor
    Windsurf
    OpenCode
    GitHub Copilot
    Qoder
    Aider
    Multi-tool

? Select output format plugins (space to select, enter to confirm):
  ❯ ◉ drawio - Professional diagrams with PNG/SVG export
    ◉ excalidraw - Hand-drawn style, great for discussions
    ◯ mermaid - Lightweight text diagrams for README

? Select document language:
  ❯ 中文 (zh-CN)
    English (en)
    Bilingual (both)

? Create design language config file? (design-language.yaml) Yes

⚙️  Generating config...
  ✓ ai-viz.config.json
  ✓ design-language.yaml
📦 Compiling instruction files...
📥 Installing to AI tool...
  ✓ Claude Code (4 files)

✅ ai-viz initialization complete!
```

After initialization, your project will have:

```
your-project/
├── ai-viz.config.json         # ai-viz configuration
├── design-language.yaml       # Visual style config (colors, layout)
└── .claude/skills/ai-viz/     # (or equivalent for your tool)
    ├── SKILL.md
    ├── drawio-instructions.md
    ├── drawio-schema.md
    └── design-language.yaml
```

## Your First Diagram

Once installed, open your AI coding tool and describe what you want:

```
You: "Draw a layered architecture diagram for this project.
      Show the API layer, service layer, and data layer."
```

The AI will:
1. Read the methodology instructions (what diagram type to use)
2. Follow routing rules (select the best format based on context)
3. Read plugin-specific instructions (exact output format specs)
4. Apply your design language (colors, spacing, fonts)
5. Generate the diagram file (e.g., `architecture.drawio`)

### Example Output

For DrawIO, you'll get an `.drawio` XML file that can be opened in Draw.io Desktop or the VS Code extension.

For Excalidraw, you'll get an `.excalidraw` JSON file that can be opened in Excalidraw or its VS Code extension.

For Mermaid, you'll get a fenced code block in Markdown that renders in GitHub, GitLab, and most documentation tools.

## Export to PNG

If you chose the drawio plugin, you can export diagrams to image files:

```bash
# Export to PNG (default, 2x scale)
npx ai-viz export architecture.drawio

# Export to SVG
npx ai-viz export architecture.drawio -f svg

# Export to PDF
npx ai-viz export architecture.drawio -f pdf

# Custom scale
npx ai-viz export architecture.drawio --scale 3
```

> **Note:** Export requires [Draw.io Desktop](https://github.com/jgraph/drawio-desktop) installed on your system.

## Customization

### Design Language

Edit `design-language.yaml` to match your project's visual identity:

```yaml
# Color system — semantic mapping
colors:
  primary: "#a5d8ff"       # Core services/nodes
  secondary: "#b2f2bb"     # External systems
  accent: "#ffd43b"        # Gateways/critical paths
  muted: "#e9ecef"         # Infrastructure/background
  danger: "#ffc9c9"        # Alerts/errors

# Layout preferences
layout:
  direction: "top-to-bottom"
  h_gap: 250
  v_gap: 180

# Format defaults by use case
format_preference:
  internal: "excalidraw"       # Internal docs → hand-drawn
  external: "drawio"           # External docs → polished
  documentation: "mermaid"     # README → text diagrams
```

After editing, re-compile to propagate changes:

```bash
npx ai-viz update
```

### Adding/Removing Plugins

```bash
# Add a new plugin
npx ai-viz add mermaid

# Remove a plugin
npx ai-viz remove excalidraw
```

## Next Steps

- [Architecture](./architecture.md) — Understand the layered design and how components interact
- [Plugin Development](./plugin-development.md) — Create a custom output format plugin
- [Rendering Specs](../../specs/) — Browse the built-in diagram type specifications
