# Draw.io XML Schema Reference

## File Structure

Draw.io uses the mxGraph XML format. Core hierarchy:

```
mxfile → diagram → mxGraphModel → root → mxCell[]
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="ai-viz" agent="ai-viz-plugin">
  <diagram name="Diagram Name" id="unique-id">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10"
                  guides="1" tooltips="1" connect="1"
                  arrows="1" fold="1" page="1"
                  pageScale="1" pageWidth="1169" pageHeight="827">
      <root>
        <mxCell id="0"/>              <!-- Root cell -->
        <mxCell id="1" parent="0"/>   <!-- Default layer -->
        <!-- All user elements with parent="1" -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

### mxfile Attributes

| Attribute | Description | Value |
|-----------|-------------|-------|
| host | Host identifier | `ai-viz` |
| agent | Agent identifier | `ai-viz-plugin` |

---

## mxGraphModel Attributes

| Attribute | Description | Recommended Value |
|-----------|-------------|-------------------|
| dx | Canvas offset X | 1200 |
| dy | Canvas offset Y | 800 |
| grid | Enable grid | 1 |
| gridSize | Grid size (px) | 10 |
| guides | Enable guides | 1 |
| tooltips | Enable tooltips | 1 |
| connect | Enable connections | 1 |
| arrows | Show arrows | 1 |
| fold | Enable folding | 1 |
| page | Enable page | 1 |
| pageScale | Page scale | 1 |
| pageWidth | Page width (px) | 1169 (A4 landscape) |
| pageHeight | Page height (px) | 827 (A4 landscape) |

---

## mxCell Common Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| id | string | Unique identifier (use semantic naming) |
| value | string | Display text (supports HTML) |
| style | string | Style string (key=value; separated) |
| vertex | "1" | Marks as node |
| edge | "1" | Marks as connection |
| parent | string | Parent element id (usually "1") |
| source | string | Connection source id (edge only) |
| target | string | Connection target id (edge only) |

---

## Style String Format

Styles are semicolon-separated key=value pairs:

```
rounded=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=14;fontStyle=1;whiteSpace=wrap;html=1;
```

**Important**: The trailing semicolon is optional but recommended for consistency.

---

## Node Style Properties

| Key | Values | Description |
|-----|--------|-------------|
| rounded | 0/1 | Rounded rectangle |
| fillColor | #hex | Fill color |
| strokeColor | #hex | Border color |
| fontColor | #hex | Text color |
| fontSize | number | Font size (px) |
| fontStyle | 0/1/2/3 | 0=normal, 1=bold, 2=italic, 3=bold+italic |
| whiteSpace | wrap | Auto word-wrap |
| html | 1 | Enable HTML rendering in value |
| align | left/center/right | Horizontal alignment |
| verticalAlign | top/middle/bottom | Vertical alignment |
| dashed | 0/1 | Dashed border |
| opacity | 0-100 | Transparency |
| shadow | 0/1 | Drop shadow |
| glass | 0/1 | Glass effect |
| spacingTop | number | Top padding |
| spacingLeft | number | Left padding |
| spacingRight | number | Right padding |
| spacingBottom | number | Bottom padding |
| labelPosition | left/center/right | Label horizontal position |
| verticalLabelPosition | top/middle/bottom | Label vertical position |

---

## Node Shape Reference

| Style Value | Description |
|-------------|-------------|
| (default) | Rectangle |
| rounded=1 | Rounded rectangle |
| ellipse | Ellipse / Circle |
| rhombus | Diamond (decision) |
| shape=cylinder3;size=15 | Database cylinder |
| shape=hexagon | Hexagon |
| shape=parallelogram | Parallelogram |
| shape=cloud | Cloud |
| shape=mxgraph.flowchart.document | Document |
| shape=mxgraph.flowchart.start_2 | Rounded terminal |
| triangle | Triangle |
| shape=process | Process (double-bordered) |
| shape=note | Sticky note |

---

## Connection (Edge) Style Properties

| Key | Values | Description |
|-----|--------|-------------|
| edgeStyle | orthogonalEdgeStyle | Orthogonal routing (right angles) |
| edgeStyle | elbowEdgeStyle | Elbow routing |
| edgeStyle | entityRelationEdgeStyle | Entity-relation style |
| curved | 1 | Curved connection |
| endArrow | blockThin | Thin solid arrow |
| endArrow | open | Open arrow |
| endArrow | classic | Classic arrow |
| endArrow | diamond | Diamond |
| endArrow | diamondThin | Thin diamond |
| endArrow | none | No arrow |
| endFill | 0/1 | Arrow fill (0=hollow, 1=solid) |
| startArrow | (same as endArrow) | Start point arrow |
| startFill | 0/1 | Start arrow fill |
| strokeColor | #hex | Line color |
| strokeWidth | number | Line width |
| dashed | 0/1 | Dashed line |
| dashPattern | "3 3" | Dash pattern |
| exitX | 0-1 | Exit point X (0=left, 1=right) |
| exitY | 0-1 | Exit point Y (0=top, 1=bottom) |
| entryX | 0-1 | Entry point X |
| entryY | 0-1 | Entry point Y |
| exitDx | number | Exit point X offset |
| exitDy | number | Exit point Y offset |
| entryDx | number | Entry point X offset |
| entryDy | number | Entry point Y offset |

---

## Coordinate System

- Origin (0, 0) at canvas top-left corner
- X increases to the right
- Y increases downward
- Unit: pixels
- **Align all coordinates to gridSize multiples (10px)**

---

## mxGeometry

### Node Geometry

```xml
<mxCell id="node-1" value="Label" style="..." vertex="1" parent="1">
  <mxGeometry x="100" y="200" width="200" height="60" as="geometry"/>
</mxCell>
```

| Attribute | Description |
|-----------|-------------|
| x | Left edge X position |
| y | Top edge Y position |
| width | Element width |
| height | Element height |
| as | Must be "geometry" |

### Edge Geometry (Relative)

```xml
<mxCell id="edge-1" value="Label" style="..." edge="1" source="node-1" target="node-2" parent="1">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

### Edge with Waypoints

```xml
<mxCell id="edge-2" value="" style="..." edge="1" source="node-1" target="node-2" parent="1">
  <mxGeometry relative="1" as="geometry">
    <Array as="points">
      <mxPoint x="300" y="150"/>
      <mxPoint x="300" y="250"/>
    </Array>
  </mxGeometry>
</mxCell>
```

---

## HTML Value (Rich Text Labels)

Value supports HTML for multi-line / mixed-style labels:

```xml
<mxCell value="&lt;b&gt;Service Name&lt;/b&gt;&lt;br&gt;&lt;font style=&quot;font-size:11px&quot;&gt;One-line responsibility&lt;/font&gt;" .../>
```

**Critical: style MUST include `html=1;` to render HTML values! Otherwise raw tags are displayed.**

```xml
<!-- ✅ Correct: style includes html=1 -->
<mxCell value="&lt;b&gt;Title&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;" .../>

<!-- ❌ Wrong: missing html=1, displays <b>Title</b> as text -->
<mxCell value="&lt;b&gt;Title&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;" .../>
```

### HTML Escape Rules

| Character | Escape |
|-----------|--------|
| `<` | `&lt;` |
| `>` | `&gt;` |
| `"` | `&quot;` |
| `&` | `&amp;` |

---

## Container Pattern (Grouping)

Place nodes inside a container by setting child `parent` to the container's id:

```xml
<!-- Container -->
<mxCell id="layer-1" value="Service Layer" style="rounded=1;fillColor=#f5f5f5;dashed=1;verticalAlign=top;" vertex="1" parent="1">
  <mxGeometry x="50" y="200" width="900" height="150" as="geometry"/>
</mxCell>

<!-- Child node (parent points to container) -->
<mxCell id="svc-1" value="ServiceA" style="rounded=1;fillColor=#dae8fc;whiteSpace=wrap;html=1;" vertex="1" parent="layer-1">
  <mxGeometry x="20" y="40" width="160" height="60" as="geometry"/>
</mxCell>
```

> Child node coordinates are **relative to the container's top-left corner**.

---

## Color Palette Quick Reference

### Professional / Business Style (Default)

| Semantic | fillColor | strokeColor |
|----------|-----------|-------------|
| Core services | #dae8fc | #6c8ebf |
| External systems | #d5e8d4 | #82b366 |
| Gateway / Accent | #fff2cc | #d6b656 |
| Infrastructure | #f5f5f5 | #666666 |
| Alert / Error | #f8cecc | #b85450 |
| Special / Purple | #e1d5e7 | #9673a6 |

### Color Usage Rules

- Max 3 primary colors per diagram
- Same layer / same type nodes use consistent color
- Connection lines default to #333333 (dark gray)
- Background containers: light gray #f5f5f5 + dashed border
