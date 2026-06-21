'use strict';

const BaseAdapter = require('./base');

/**
 * InstructionsAdapter - Base class for tools that use a single merged file.
 *
 * Output format: one markdown file containing all core methodology + plugin
 * instructions + design language. Used by Codex, Copilot, Aider.
 *
 * Subclasses implement getOutputDir, detect, install, uninstall (file handling
 * differs: overwrite vs append-with-markers vs config-file). This base class
 * provides the shared _buildInstructions() content builder.
 */
class InstructionsAdapter extends BaseAdapter {
  constructor(name, config = {}) {
    super(name, { toolId: name.toLowerCase().replace(/\s+/g, '-'), ...config });

    this.title = config.title || '# AI Visualization';
    this.intro =
      config.intro ||
      'When the user asks to create diagrams, architecture diagrams, sequence diagrams, flowcharts, or mentions drawio/excalidraw/mermaid, follow these instructions.';
  }

  _buildInstructions(compiled) {
    const { core, plugins } = compiled;
    const lines = [];

    lines.push(this.title);
    lines.push('');
    lines.push(this.intro);
    lines.push('');

    lines.push('## Core Methodology');
    lines.push('');
    lines.push(core.methodology);
    lines.push('');

    lines.push('## Diagram Type Routing');
    lines.push('');
    lines.push(core.routing);
    lines.push('');

    lines.push('## Quality Control');
    lines.push('');
    lines.push(core.quality);
    lines.push('');

    if (plugins && plugins.length > 0) {
      lines.push('## Plugin Instructions');
      lines.push('');
      for (const plugin of plugins) {
        const pj = plugin.pluginJson;
        const displayName = pj.displayName || plugin.name;
        lines.push(`### ${displayName}`);
        lines.push('');
        if (plugin.instructions) {
          lines.push(plugin.instructions);
          lines.push('');
        }
        if (plugin.schema) {
          lines.push('#### Schema Reference');
          lines.push('');
          lines.push(plugin.schema);
          lines.push('');
        }
      }
    }

    if (compiled.designLanguage) {
      lines.push('## Design Language');
      lines.push('');
      lines.push('```yaml');
      lines.push(compiled.designLanguage);
      lines.push('```');
      lines.push('');
    }

    return lines.join('\n');
  }
}

module.exports = InstructionsAdapter;
