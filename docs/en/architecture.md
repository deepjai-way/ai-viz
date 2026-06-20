# Architecture

This document explains the internal design of ai-viz for contributors and advanced users.

## Design Philosophy

ai-viz is built on a core principle: **separate what to visualize from how to visualize it**.

- The **methodology layer** defines *what* diagram to draw and *when*
- The **plugin layer** defines *how* to generate the specific output format
- The **adapter layer** translates compiled output into each AI tool's native format

This separation means:
- Adding a new output format only requires writing a plugin
- Supporting a new AI tool only requires writing an adapter
- Core methodology evolves independently of formats and tools

## Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLI Layer (bin/cli.js)                     │
│              Commands: init, add, remove, export, update      │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                   Compiler (src/compiler/)                    │
│         Reads config → loads sources → assembles output       │
└──────────┬──────────────────┬───────────────────┬───────────┘
           │                  │                   │
┌──────────▼──────┐ ┌────────▼────────┐ ┌────────▼──────────┐
│  Core Layer     │ │  Plugin Layer   │ │  Design Language  │
│  (core/)        │ │  (plugins/)     │ │  (templates/)     │
│                 │ │                 │ │                   │
│  · methodology  │ │  · drawio       │ │  · colors         │
│  · routing      │ │  · excalidraw   │ │  · typography     │
│  · quality      │ │  · mermaid      │ │  · layout         │
└─────────────────┘ └─────────────────┘ └───────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                  Adapter Layer (src/adapters/)                │
│                                                              │
│  claude-code │ cursor │ windsurf │ opencode │ copilot │ ... │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
              AI Tool's Native Instruction Directory
```

### Responsibility Matrix

| Responsibility | Methodology | Plugin | Adapter |
|----------------|:-----------:|:------:|:-------:|
| Decide what diagram type to draw | ✅ | | |
| Decide which format to use | ✅ | | |
| Define design language contract | ✅ | | |
| Generate formatted output (XML/JSON/text) | | ✅ | |
| Self-check quality | | ✅ | |
| Export to image files | | ✅ | |
| Map to tool's file structure | | | ✅ |
| Handle tool-specific frontmatter | | | ✅ |
| Detect tool presence | | | ✅ |

## Plugin System

### Overview

Each plugin lives in `plugins/<name>/` and provides:
- Format-specific AI instructions (how to generate that format)
- Schema reference (format specification)
- Optional export driver (for image conversion)

### Plugin Interface (`plugin.json`)

```json
{
  "name": "drawio",
  "version": "1.0.0",
  "displayName": "Draw.io Professional Diagrams",
  "displayName_zh": "Draw.io 专业图表",
  "description": "Generate Draw.io XML diagrams with CLI export to PNG/SVG/PDF",
  "description_zh": "生成 Draw.io XML 格式图表，支持 CLI 导出 PNG/SVG/PDF",
  "capabilities": ["generate", "edit", "export"],
  "triggers": {
    "en": ["drawio", "professional diagram", "export PNG"],
    "zh": ["drawio", "专业架构图", "导出PNG"]
  },
  "export": {
    "formats": ["png", "svg", "pdf"],
    "driver": "./export.js",
    "requires": "drawio-desktop"
  },
  "files": {
    "instructions": "./instructions.md",
    "instructions_zh": "./instructions.zh-CN.md",
    "schema": "./schema.md"
  }
}
```

### Plugin Loading

The Compiler loads plugins based on the `plugins` array in `ai-viz.config.json`:

1. Reads `plugin.json` for metadata
2. Loads `instructions.md` (or `instructions.zh-CN.md` based on language)
3. Loads `schema.md` if present
4. Passes structured data to the adapter

## Adapter System

### Overview

Each adapter translates compiled output into the specific format understood by an AI coding tool. Adapters handle differences in:
- File location (where instructions are stored)
- File format (`.mdc`, `.md`, YAML frontmatter, etc.)
- File structure (single-file vs multi-file)
- Reference mechanism (file links vs inline content)

### Adapter Interface

All adapters extend `BaseAdapter`:

```javascript
class BaseAdapter {
  getOutputDir(projectRoot)          // → output directory path
  async detect(projectRoot)          // → boolean (is this tool active?)
  async install(projectRoot, compiled) // → string[] (created files)
  async uninstall(projectRoot)       // → string[] (removed files)
}
```

### Adapter Differences

| Adapter | Output Dir | File Format | Structure |
|---------|-----------|-------------|-----------|
| Claude Code | `.claude/skills/ai-viz/` | `.md` + YAML frontmatter | Multi-file (SKILL.md + per-plugin) |
| Cursor | `.cursor/rules/` | `.mdc` + frontmatter | Multi-file (core + per-plugin) |
| Windsurf | `.windsurf/rules/` | `.md` + frontmatter | Multi-file (core + per-plugin) |
| OpenCode | `.opencode/agents/` | `.md` + JSON config | Single agent file + opencode.json |
| GitHub Copilot | `.github/` | `.md` with markers | Single file (appends to copilot-instructions.md) |
| Qoder | `skills/ai-viz/` | `.md` + YAML frontmatter | Multi-file (SKILL.md + per-plugin) |
| Aider | `.ai-viz/` | `.md` + conf reference | Single instructions.md + .aider.conf.yml |

### Creating a New Adapter

1. Create `src/adapters/<tool-name>.js`
2. Extend `BaseAdapter`
3. Implement `getOutputDir`, `detect`, `install`, `uninstall`
4. Register in `src/commands/init.js` ADAPTERS map

## Compiler

The Compiler (`src/compiler/index.js`) is the assembly engine:

```javascript
const compiled = compiler.compile();
// Returns:
// {
//   core: { methodology, routing, quality },
//   plugins: [{ name, instructions, schema, pluginJson }],
//   specs: { architecture: {...}, behavior: {...} },
//   designLanguage: "yaml string",
//   config: { tool, plugins, language, ... }
// }
```

### Compilation Flow

1. **Load config** — reads `ai-viz.config.json` from project root
2. **Load core** — reads methodology/routing/quality files (language-aware)
3. **Load plugins** — reads instructions + schema for each selected plugin
4. **Load specs** — reads rendering specifications by category
5. **Load design language** — reads `design-language.yaml` (project → config → template fallback)
6. **Return structured object** — adapters consume this to generate output

### Language Resolution

The compiler resolves files by language with English fallback:
- `zh-CN` → tries `methodology.zh-CN.md`, falls back to `methodology.md`
- `en` → loads `methodology.md` directly

## Directory Structure (Complete)

```
ai-viz/
├── bin/
│   └── cli.js                       # CLI entry (requires src/index.js)
├── src/
│   ├── index.js                     # Command registration (commander)
│   ├── commands/
│   │   ├── init.js                  # Interactive setup wizard
│   │   ├── add.js                   # Add plugin to existing config
│   │   ├── remove.js                # Remove plugin
│   │   ├── export.js                # Export drawio to image
│   │   └── update.js               # Re-compile and re-install
│   ├── compiler/
│   │   └── index.js                 # Compiler class
│   ├── adapters/
│   │   ├── base.js                  # Abstract BaseAdapter
│   │   ├── claude-code.js           # Claude Code adapter
│   │   ├── cursor.js                # Cursor adapter
│   │   ├── windsurf.js              # Windsurf adapter
│   │   ├── opencode.js              # OpenCode adapter
│   │   ├── copilot.js               # GitHub Copilot adapter
│   │   ├── qoder.js                 # Qoder adapter
│   │   └── aider.js                 # Aider adapter
│   └── utils/
│       ├── detect-tool.js           # Auto-detect active AI tool
│       └── detect-drawio.js         # Detect Draw.io Desktop
├── core/
│   ├── methodology.md               # Core methodology (EN)
│   ├── methodology.zh-CN.md         # Core methodology (ZH)
│   ├── routing.md                   # Diagram type routing (EN)
│   ├── routing.zh-CN.md             # Diagram type routing (ZH)
│   ├── quality.md                   # Quality control (EN)
│   └── quality.zh-CN.md             # Quality control (ZH)
├── plugins/
│   ├── drawio/
│   │   ├── plugin.json              # Plugin manifest
│   │   ├── instructions.md          # AI instructions (EN)
│   │   ├── instructions.zh-CN.md    # AI instructions (ZH)
│   │   ├── schema.md                # DrawIO XML schema reference
│   │   └── export.js                # Export driver
│   ├── excalidraw/
│   │   ├── plugin.json
│   │   ├── instructions.md
│   │   ├── instructions.zh-CN.md
│   │   └── schema.md
│   └── mermaid/
│       ├── plugin.json
│       ├── instructions.md
│       └── instructions.zh-CN.md
├── specs/
│   ├── architecture/
│   │   └── layered.md               # Layered architecture spec
│   ├── behavior/
│   │   └── sequence.md              # Sequence diagram spec
│   └── concept/
│       ├── comparison.md            # Comparison matrix spec
│       ├── convergence.md           # Convergence/radial spec
│       └── timeline.md              # Timeline spec
├── templates/
│   ├── ai-viz.config.json           # Config template
│   └── design-language.yaml         # Design language template
├── package.json
└── LICENSE
```

## Key Design Decisions

1. **No runtime dependency** — ai-viz generates static files; no daemon or background process
2. **Compile-time approach** — instructions are compiled once and installed; AI tools read them natively
3. **Fallback chain** — design language: project file → config path → package template
4. **Marker-based updates** — for single-file adapters (Copilot), markers enable safe partial updates
5. **Self-contained plugins** — each plugin carries its own instructions, schema, and optional export logic
