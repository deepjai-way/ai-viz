# Draw.io Professional Diagram Generation Instructions

Generate Draw.io XML diagrams based on the AI Visualization methodology. Supports CLI export to PNG/SVG/PDF, suitable for client-facing proposals, formal documentation, and professional scenarios.

---

## 1. Trigger & Routing

### 1.1 Explicit Triggers

Execute directly when user says "drawio" / "professional diagram" / "export PNG" / "formal diagram".

### 1.2 Auto-recommend Draw.io Scenarios

| Scenario | Reason |
|----------|--------|
| Client-facing proposals | Professional, exportable to high-res images |
| PPT / Presentation materials | Needs PNG/SVG embedding |
| Precise alignment and layout | Draw.io grid system is more accurate |
| Formal design reviews | Business style is more appropriate |

### 1.3 Boundary with Excalidraw

| Scenario | Use Excalidraw | Use Draw.io |
|----------|---------------|-------------|
| Internal design docs | ✅ | |
| Client-facing proposals | | ✅ |
| Quick whiteboard discussion | ✅ | |
| PPT / Formal presentations | | ✅ |
| README level | Use Mermaid | |

---

## 2. Execution Flow

### 2.1 Create Mode (First Generation)

```
Step 1: Knowledge Source Reading
  - If user specifies a document path → read document, extract relevant sections
  - If natural language description → extract structure from description

Step 2: Diagram Type Confirmation (Confidence Grading)
  - High confidence → proceed to Step 3, explain reasoning
  - Low confidence → recommend type + alternatives, wait for confirmation

Step 3: Structure Extraction
  - Identify nodes (entities/services/participants)
  - Identify relationships (calls/dependencies/data flows)
  - Identify hierarchy (layers/groups/swimlanes)

Step 4: Layout Planning
  - Load rendering specs for the diagram type (specs/ directory)
  - Load design language colors (design-language.yaml)
  - Calculate coordinate grid, apply Draw.io auto-layout parameters

Step 5: Generate XML
  - Generate .drawio file
  - Execute quality checklist
  - Output file path + summary

Step 6: Export (Optional)
  - When user requests export, call CLI to export as PNG/SVG/PDF
```

### 2.2 Edit Mode (Modify Existing Diagram)

When user requests modifications to an existing .drawio file:
1. Read existing XML
2. Parse mxCell structure, locate elements to modify
3. Only modify affected parts (add/delete/move nodes)
4. Preserve existing styles and layout
5. Never regenerate from scratch

---

## 3. Design Language

### 3.1 Color Mapping

Prefer reading `design-language.yaml` from the project. If unavailable, use defaults:

| Semantic Slot | Default Color | Usage |
|--------------|---------------|-------|
| primary | `#dae8fc` | Core business services |
| secondary | `#d5e8d4` | External systems / access layer |
| accent | `#fff2cc` | Gateways / key nodes |
| muted | `#f5f5f5` | Infrastructure |
| danger | `#f8cecc` | Alerts / attention needed |
| text | `#333333` | Text |
| stroke | `#333333` | Default border color |

### 3.2 Draw.io vs Excalidraw Color Comparison

Draw.io colors are softer, suitable for professional documents:

| Semantic | Excalidraw | Draw.io |
|----------|-----------|---------|
| Primary | `#a5d8ff` | `#dae8fc` (strokeColor=`#6c8ebf`) |
| External | `#b2f2bb` | `#d5e8d4` (strokeColor=`#82b366`) |
| Accent | `#ffd43b` | `#fff2cc` (strokeColor=`#d6b656`) |
| Muted | `#e9ecef` | `#f5f5f5` (strokeColor=`#666666`) |
| Danger | `#ffc9c9` | `#f8cecc` (strokeColor=`#b85450`) |

### 3.3 Aesthetic Principles

1. **Clear layering**: 3-4 horizontal layers, each with its own color scheme
2. **Color restraint**: No more than 3 primary colors
3. **Arrow labels**: Every connection line labeled with what it transmits
4. **Ample whitespace**: Sufficient spacing between elements
5. **Strict alignment**: All elements grid-aligned, no misalignment allowed

---

## 4. XML Technical Specification

### 4.1 File Skeleton

```xml
<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="ai-viz" agent="ai-viz-plugin">
  <diagram name="Architecture" id="diagram-001">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10"
                  guides="1" tooltips="1" connect="1"
                  arrows="1" fold="1" page="1"
                  pageScale="1" pageWidth="1169" pageHeight="827">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <!-- All diagram elements go here -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

### 4.2 Nodes (Rectangles)

```xml
<mxCell id="node-xxx" value="&lt;b&gt;Node Label&lt;/b&gt;&lt;br&gt;&lt;font style=&quot;font-size:11px&quot;&gt;One-line description&lt;/font&gt;" style="rounded=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontColor=#333333;fontSize=14;fontStyle=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="200" height="60" as="geometry"/>
</mxCell>
```

> **Important**: When value contains HTML tags, style MUST include `html=1;`, otherwise raw tags will be displayed.

### 4.3 Connections (Arrows)

```xml
<mxCell id="edge-xxx" value="Label text" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#333333;fontSize=11;endArrow=blockThin;endFill=1;" edge="1" source="node-a" target="node-b" parent="1">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

### 4.4 Common Style Properties

| Property | Description | Example Values |
|----------|-------------|----------------|
| rounded | Rounded corners | 0/1 |
| fillColor | Fill color | #dae8fc |
| strokeColor | Border color | #6c8ebf |
| fontColor | Text color | #333333 |
| fontSize | Font size | 12-16 |
| fontStyle | Font style | 0=normal, 1=bold, 2=italic |
| dashed | Dashed line | 0/1 |
| edgeStyle | Edge style | orthogonalEdgeStyle / elbowEdgeStyle |
| endArrow | Arrow type | blockThin / open / classic / none |
| endFill | Arrow fill | 0/1 |
| shape | Special shape | cylinder3 / hexagon / cloud |
| verticalAlign | Vertical align | top / middle / bottom |
| whiteSpace | Word wrap | wrap |
| html | Enable HTML rendering | 1 |

### 4.5 Layer Backgrounds (Containers)

```xml
<mxCell id="layer-xxx" value="Access Layer" style="rounded=1;fillColor=#f5f5f5;strokeColor=#666666;dashed=1;fontSize=12;fontStyle=2;verticalAlign=top;align=left;spacingLeft=10;spacingTop=5;" vertex="1" parent="1">
  <mxGeometry x="50" y="50" width="900" height="120" as="geometry"/>
</mxCell>
```

Child nodes reference the container via `parent` attribute; coordinates are relative to the container's top-left corner.

### 4.6 Database Shape

```xml
<mxCell id="db-xxx" value="MySQL" style="shape=cylinder3;size=15;fillColor=#f5f5f5;strokeColor=#666666;fontSize=12;whiteSpace=wrap;html=1;" vertex="1" parent="1">
  <mxGeometry x="100" y="400" width="80" height="60" as="geometry"/>
</mxCell>
```

---

## 5. CLI Export

### 5.1 Cross-Platform Export Commands

Draw.io Desktop supports command-line export. Use the appropriate command for your OS:

**Windows:**
```bash
"C:\Program Files\draw.io\draw.io.exe" -x -f png -o output.png input.drawio
```

**macOS:**
```bash
/Applications/draw.io.app/Contents/MacOS/draw.io -x -f png -o output.png input.drawio
```

**Linux:**
```bash
drawio -x -f png -o output.png input.drawio
```

**Using ai-viz CLI (recommended, auto-detects platform):**
```bash
npx ai-viz export input.drawio -f png -o output.png
```

### 5.2 Common Export Parameters

```bash
# Export PNG
draw.io -x -f png -o output.png input.drawio

# Export SVG
draw.io -x -f svg -o output.svg input.drawio

# Export PDF
draw.io -x -f pdf -o output.pdf input.drawio

# Specify page (multi-page diagrams)
draw.io -x -f png -p 0 -o page1.png input.drawio

# Specify scale
draw.io -x -f png --scale 2 -o output@2x.png input.drawio
```

### 5.3 Export Timing

| Scenario | Auto-export? |
|----------|-------------|
| User says "export PNG" | Yes |
| Client-facing document | Recommend export, wait for confirmation |
| Daily dev documentation | No export, use .drawio directly |

---

## 6. Quality Checklist

After generating XML, verify:

- [ ] XML tags properly closed
- [ ] All mxCell ids are unique (no duplicates)
- [ ] All connections have value labels (describing what's transmitted)
- [ ] source/target reference existing ids
- [ ] Layout direction is consistent (don't mix top-down and left-right)
- [ ] Colors follow design language
- [ ] Reasonable node count (≤ 20 core nodes per diagram)
- [ ] No overlaps (verify via coordinate calculation)
- [ ] Special characters escaped (& → `&amp;`, < → `&lt;`, > → `&gt;`)
- [ ] Style includes `html=1` (when using HTML values)

---

## 7. Output Specification

After each generation, provide:

1. `.drawio` file
2. Summary: diagram type + node count + key structural notes
3. Export recommendation: if client-facing, proactively ask about PNG export
4. How to open:
   - VS Code Draw.io Integration extension
   - Draw.io Desktop (double-click)
   - Online at app.diagrams.net (import)

---

## 8. Iteration Protocol

- User feedback → Edit mode, targeted XML node modification
- Preserve existing layout, only change affected parts
- Maximum 5 iterations
- Beyond that, suggest splitting or re-clarifying requirements
- After each modification, can immediately export PNG to verify

---

## Schema Reference

See `schema.md` for detailed XML schema documentation.
