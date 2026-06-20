# Excalidraw JSON Schema Reference

Complete schema reference for generating valid Excalidraw JSON files.

---

## Top-Level Structure

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

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | Yes | Always `"excalidraw"` |
| version | number | Yes | Schema version, currently `2` |
| source | string | Yes | Origin URL |
| elements | array | Yes | Array of diagram elements |
| appState | object | Yes | Application state settings |
| files | object | Yes | Embedded files (usually `{}`) |

---

## Element Base Properties

All elements share these common properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | string | Yes | Unique identifier (use semantic names, e.g., `"node-api-gateway"`) |
| type | string | Yes | `rectangle` / `ellipse` / `diamond` / `arrow` / `text` / `line` |
| x | number | Yes | X coordinate (pixels, origin top-left, increases rightward) |
| y | number | Yes | Y coordinate (pixels, origin top-left, increases downward) |
| width | number | Yes | Element width in pixels |
| height | number | Yes | Element height in pixels |
| angle | number | Yes | Rotation in radians (typically `0`) |
| strokeColor | string | Yes | Border color, e.g., `"#1e1e1e"` |
| backgroundColor | string | Yes | Fill color or `"transparent"` |
| fillStyle | string | Yes | `"solid"` / `"hachure"` / `"cross-hatch"` |
| strokeWidth | number | Yes | Border width (`1`-`4`) |
| strokeStyle | string | Yes | `"solid"` / `"dashed"` / `"dotted"` |
| roughness | number | Yes | Hand-drawn feel (`0`-`2`, default `1`) |
| opacity | number | Yes | Transparency (`0`-`100`) |
| groupIds | string[] | Yes | Group ID list (empty array `[]` if ungrouped) |
| frameId | null | Yes | Usually `null` |
| index | string | Yes | Z-order layer index (e.g., `"a0"`, `"a1"`) |
| roundness | object/null | Yes | Corner rounding settings |
| seed | number | Yes | Random seed for hand-drawn rendering |
| version | number | Yes | Element version (>= `1`) |
| versionNonce | number | Yes | Version random nonce |
| isDeleted | boolean | Yes | Always `false` for visible elements |
| boundElements | null/array | Yes | Usually `null` |
| updated | number | Yes | Timestamp in milliseconds |
| link | null | Yes | Usually `null` |
| locked | boolean | Yes | Lock state, typically `false` |

---

## Rectangle

Used for: service nodes, module boxes, actors, containers.

```json
{
  "id": "node-user-service",
  "type": "rectangle",
  "x": 100,
  "y": 100,
  "width": 200,
  "height": 80,
  "strokeColor": "#1e1e1e",
  "backgroundColor": "#a5d8ff",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "strokeStyle": "solid",
  "roughness": 1,
  "opacity": 100,
  "angle": 0,
  "groupIds": [],
  "frameId": null,
  "index": "a0",
  "roundness": { "type": 3 },
  "seed": 1234567890,
  "version": 1,
  "versionNonce": 987654321,
  "isDeleted": false,
  "boundElements": null,
  "updated": 1706659200000,
  "link": null,
  "locked": false
}
```

**Notes:**
- `roundness.type = 3` → rounded rectangle (recommended for most nodes)
- `roundness = null` → sharp corners

---

## Ellipse

Used for: databases, external entities, start/end points.

```json
{
  "id": "db-postgres",
  "type": "ellipse",
  "x": 100,
  "y": 100,
  "width": 160,
  "height": 80,
  "strokeColor": "#1e1e1e",
  "backgroundColor": "#e9ecef",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "strokeStyle": "solid",
  "roughness": 1,
  "opacity": 100,
  "angle": 0,
  "groupIds": [],
  "frameId": null,
  "index": "a0",
  "roundness": { "type": 2 },
  "seed": 1234567890,
  "version": 1,
  "versionNonce": 987654321,
  "isDeleted": false,
  "boundElements": null,
  "updated": 1706659200000,
  "link": null,
  "locked": false
}
```

**Notes:**
- `roundness.type = 2` for ellipse
- No `roundness` property needed (use `null` or `{"type": 2}`)

---

## Diamond

Used for: decision points, conditional branches.

```json
{
  "id": "decision-auth-check",
  "type": "diamond",
  "x": 150,
  "y": 200,
  "width": 120,
  "height": 100,
  "strokeColor": "#1e1e1e",
  "backgroundColor": "#ffd43b",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "strokeStyle": "solid",
  "roughness": 1,
  "opacity": 100,
  "angle": 0,
  "groupIds": [],
  "frameId": null,
  "index": "a0",
  "roundness": { "type": 2 },
  "seed": 5555555555,
  "version": 1,
  "versionNonce": 6666666666,
  "isDeleted": false,
  "boundElements": null,
  "updated": 1706659200000,
  "link": null,
  "locked": false
}
```

---

## Text

Used for: labels, annotations, standalone text.

```json
{
  "id": "label-user-service",
  "type": "text",
  "x": 120,
  "y": 130,
  "width": 160,
  "height": 25,
  "text": "User Service",
  "fontSize": 20,
  "fontFamily": 5,
  "textAlign": "center",
  "verticalAlign": "middle",
  "strokeColor": "#1e1e1e",
  "backgroundColor": "transparent",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "strokeStyle": "solid",
  "roughness": 1,
  "opacity": 100,
  "angle": 0,
  "groupIds": [],
  "frameId": null,
  "index": "a1",
  "roundness": null,
  "seed": 1111111111,
  "version": 1,
  "versionNonce": 2222222222,
  "isDeleted": false,
  "boundElements": null,
  "updated": 1706659200000,
  "link": null,
  "locked": false
}
```

**Critical Rules:**
- `fontFamily` MUST be `5` (Excalifont) — mandatory for all text
- `textAlign`: `"left"` / `"center"` / `"right"`
- `verticalAlign`: `"top"` / `"middle"`

**Text Size Estimation:**
- English: `width ≈ charCount × fontSize × 0.6`
- CJK (Chinese/Japanese/Korean): `width ≈ charCount × fontSize × 1.0`
- Height: `height ≈ fontSize × 1.25 × lineCount`

---

## Arrow

Used for: connections, data flows, relationships.

```json
{
  "id": "arrow-user-to-gateway",
  "type": "arrow",
  "x": 300,
  "y": 140,
  "width": 200,
  "height": 0,
  "points": [[0, 0], [200, 0]],
  "strokeColor": "#1e1e1e",
  "backgroundColor": "transparent",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "strokeStyle": "solid",
  "roughness": 1,
  "opacity": 100,
  "angle": 0,
  "groupIds": [],
  "frameId": null,
  "index": "a2",
  "roundness": { "type": 2 },
  "seed": 3333333333,
  "version": 1,
  "versionNonce": 4444444444,
  "isDeleted": false,
  "boundElements": null,
  "updated": 1706659200000,
  "link": null,
  "locked": false,
  "startBinding": null,
  "endBinding": null,
  "startArrowhead": null,
  "endArrowhead": "arrow"
}
```

**Arrow-Specific Properties:**

| Property | Type | Description |
|----------|------|-------------|
| points | number[][] | Array of [x, y] offsets from origin. First point is always `[0, 0]` |
| startBinding | null/object | Binding to start element |
| endBinding | null/object | Binding to end element |
| startArrowhead | null/string | Start arrowhead type (`null` = none) |
| endArrowhead | null/string | End arrowhead type (`"arrow"` = standard) |

**Points Pattern:**
- First point: `[0, 0]` (relative to `x`, `y`)
- Subsequent points: offsets from the arrow's `(x, y)` position
- Horizontal right arrow: `[[0, 0], [width, 0]]`
- Vertical down arrow: `[[0, 0], [0, height]]`
- Diagonal arrow: `[[0, 0], [deltaX, deltaY]]`
- Multi-segment: `[[0, 0], [midX, midY], [endX, endY]]`

**Arrowhead Options:**
- `null` — no arrowhead
- `"arrow"` — standard triangle arrowhead
- `"bar"` — flat bar
- `"dot"` — circle dot

---

## Line

Used for: lifelines (sequence diagrams), separators, borders.

```json
{
  "id": "lifeline-user",
  "type": "line",
  "x": 200,
  "y": 100,
  "width": 0,
  "height": 400,
  "points": [[0, 0], [0, 400]],
  "strokeColor": "#1e1e1e",
  "backgroundColor": "transparent",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "strokeStyle": "dashed",
  "roughness": 1,
  "opacity": 100,
  "angle": 0,
  "groupIds": [],
  "frameId": null,
  "index": "a3",
  "roundness": { "type": 2 },
  "seed": 7777777777,
  "version": 1,
  "versionNonce": 8888888888,
  "isDeleted": false,
  "boundElements": null,
  "updated": 1706659200000,
  "link": null,
  "locked": false
}
```

---

## Color Reference

| Name | Hex | Semantic Use |
|------|-----|--------------|
| Black | `#1e1e1e` | Default stroke / text |
| Light Blue | `#a5d8ff` | Primary services |
| Light Green | `#b2f2bb` | External / access layer |
| Light Yellow | `#ffd43b` | Core / highlighted |
| Light Red | `#ffc9c9` | Alerts / warnings |
| Light Gray | `#e9ecef` | Infrastructure |
| Cyan | `#96f2d7` | Auxiliary |
| Transparent | `transparent` | No fill |
| White | `#ffffff` | Background |

---

## Coordinate System

- Origin `(0, 0)` at top-left corner
- X axis increases rightward
- Y axis increases downward
- Unit: pixels
- Grid alignment: multiples of `10px` recommended

---

## Index (Z-Order) Convention

Elements are layered using alphabetical index strings:
- `"a0"`, `"a1"`, `"a2"` — sequential ordering
- Lower index = further back (rendered first)
- Higher index = closer to front (rendered on top)

Recommended ordering:
1. Background shapes (containers, swimlanes)
2. Node shapes (rectangles, ellipses, diamonds)
3. Connections (arrows, lines)
4. Text labels (topmost)
