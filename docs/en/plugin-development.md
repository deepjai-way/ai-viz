# Plugin Development Guide

This guide explains how to create a new output format plugin for ai-viz.

## Plugin Structure

Each plugin lives in `plugins/<name>/` with the following structure:

```
plugins/my-plugin/
├── plugin.json              # Plugin manifest (required)
├── instructions.md          # AI instructions - English (required)
├── instructions.zh-CN.md   # AI instructions - Chinese (optional)
├── schema.md                # Format schema reference (optional)
└── export.js                # Export driver (optional)
```

## plugin.json Schema

The manifest file defines your plugin's metadata and capabilities.

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "displayName": "My Plugin Diagrams",
  "displayName_zh": "我的插件图表",
  "description": "Generate diagrams in My Format",
  "description_zh": "生成 My Format 格式的图表",
  "capabilities": ["generate", "edit"],
  "triggers": {
    "en": ["my-format", "custom diagram"],
    "zh": ["我的格式", "自定义图表"]
  },
  "export": {
    "formats": ["png", "svg"],
    "driver": "./export.js",
    "requires": "my-tool-cli"
  },
  "files": {
    "instructions": "./instructions.md",
    "instructions_zh": "./instructions.zh-CN.md",
    "schema": "./schema.md"
  }
}
```

### Field Reference

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `name` | string | ✅ | Unique plugin identifier (lowercase, no spaces) |
| `version` | string | ✅ | Semantic version |
| `displayName` | string | ✅ | Human-readable name (English) |
| `displayName_zh` | string | | Human-readable name (Chinese) |
| `description` | string | ✅ | One-line description (English) |
| `description_zh` | string | | One-line description (Chinese) |
| `capabilities` | string[] | ✅ | Supported operations: `generate`, `edit`, `export` |
| `triggers.en` | string[] | ✅ | English keywords that activate this plugin |
| `triggers.zh` | string[] | | Chinese keywords that activate this plugin |
| `export` | object | | Export configuration (only if `capabilities` includes `export`) |
| `export.formats` | string[] | | Supported export formats (e.g., `png`, `svg`, `pdf`) |
| `export.driver` | string | | Path to export driver script |
| `export.requires` | string | | External tool required for export |
| `files.instructions` | string | ✅ | Path to English instructions file |
| `files.instructions_zh` | string | | Path to Chinese instructions file |
| `files.schema` | string | | Path to format schema reference |

## Writing instructions.md

The instructions file is the most important part of your plugin. It tells the AI **how** to generate diagrams in your format.

### Best Practices

1. **Be specific** — Include exact output format rules, not vague descriptions
2. **Show examples** — Include minimal complete examples the AI can reference
3. **Define constraints** — Specify what the AI must and must not do
4. **Reference design language** — Explain how to apply colors/fonts from `design-language.yaml`
5. **Cover both modes** — Describe behavior for Create mode and Edit mode

### Recommended Structure

```markdown
# {Plugin Name} Generation Instructions

## Output Format
- File extension: `.xxx`
- Encoding: UTF-8
- Basic structure overview

## Generation Rules
1. Rule about node creation
2. Rule about connections/edges
3. Rule about labeling
4. Rule about layout

## Design Language Mapping
- How to apply `colors.primary` → ...
- How to apply `colors.secondary` → ...
- How to apply `layout.direction` → ...

## Create Mode
Full generation flow from knowledge source.

## Edit Mode
How to make targeted modifications while preserving layout.

## Quality Checklist
- [ ] All nodes have labels
- [ ] Connections indicate what is transmitted
- [ ] Colors follow semantic mapping
- [ ] Layout follows direction preference

## Minimal Complete Example

{A skeleton example showing the format structure}
```

### Language Support

If you provide `instructions.zh-CN.md`, it will be used when the user's configured language is `zh-CN`. Otherwise, the English version is used as fallback.

Both files should have equivalent content — just translated.

## Adding Export Support

Export is optional. If your format can be converted to images, you can provide an export driver.

### Export Driver Interface

Create `export.js` that exports a function:

```javascript
'use strict';

const { execSync } = require('child_process');
const path = require('path');

/**
 * Export a diagram file to the specified format.
 * @param {string} inputFile - Absolute path to the source diagram file
 * @param {Object} options - Export options
 * @param {string} options.format - Target format ('png', 'svg', 'pdf')
 * @param {string} options.scale - Scale factor (default '2')
 * @param {string} options.output - Output file path (optional, auto-generated if not provided)
 * @returns {string} Path to the exported file
 */
module.exports = function exportDiagram(inputFile, options = {}) {
  const { format = 'png', scale = '2', output } = options;

  // Determine output path
  const outputFile = output || inputFile.replace(
    path.extname(inputFile),
    `.${format}`
  );

  // Call external tool (example)
  execSync(`my-tool-cli export "${inputFile}" --format ${format} --scale ${scale} --output "${outputFile}"`, {
    stdio: 'inherit',
  });

  return outputFile;
};
```

### Requirements

- The `export.requires` field in `plugin.json` should name the external CLI tool needed
- The export driver should throw a clear error if the required tool is not installed
- Support at minimum `png` format; `svg` and `pdf` are recommended

## Writing schema.md

The schema file provides a format reference that helps the AI generate valid output. It should include:

- File format specification (XML structure, JSON schema, syntax rules)
- Valid element types and their attributes
- Connection/edge types
- Styling properties
- Common patterns

### Example (abbreviated)

```markdown
# My Format Schema Reference

## File Structure
The output file is a JSON object with the following top-level structure:
...

## Element Types
### Rectangle
- `type`: "rectangle"
- `x`, `y`: Position (number)
- `width`, `height`: Dimensions (number)
- `label`: Display text (string)
- `fill`: Background color (hex string)
...

## Connection Types
### Arrow
- `type`: "arrow"
- `source`: Source element ID
- `target`: Target element ID
- `label`: Edge label (string)
...
```

## Testing Your Plugin

### Manual Testing

1. Add your plugin to the `plugins/` directory
2. Create a test project and run `npx ai-viz init`
3. Select your plugin during setup
4. Verify the compiled instructions appear in the AI tool's directory
5. Test with your AI tool — ask it to generate a diagram

### Verification Checklist

- [ ] `plugin.json` is valid JSON with all required fields
- [ ] `instructions.md` exists and is non-empty
- [ ] Plugin appears in the interactive selection during `npx ai-viz init`
- [ ] Compiled output includes your plugin's instructions
- [ ] AI tool can read and follow the instructions
- [ ] Generated diagrams open correctly in the target viewer
- [ ] (If export) `npx ai-viz export` works with your format

## Publishing

To contribute your plugin to the main repository:

1. **Fork** the ai-viz repository
2. **Create** your plugin in `plugins/<name>/`
3. **Test** thoroughly with at least two AI tools
4. **Submit** a pull request with:
   - Plugin directory with all required files
   - Brief description of the format and use case
   - Example output file (in a test/ directory)

### Contribution Guidelines

- Plugin name should be the format's common name (lowercase)
- Instructions should be concise but complete
- Include both English and Chinese instructions if possible
- Export drivers should handle errors gracefully
- Follow existing plugins as reference implementations
