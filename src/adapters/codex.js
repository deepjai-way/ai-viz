'use strict';

const fs = require('fs-extra');
const path = require('path');
const BaseAdapter = require('./base');

/**
 * Adapter for OpenAI Codex CLI.
 * Output target: project root as codex.md
 *
 * Single-file design: methodology + routing + all plugin instructions
 * merged into one clean Markdown file (no frontmatter, no HTML markers).
 */
class CodexAdapter extends BaseAdapter {
  constructor(config = {}) {
    super('Codex', { toolId: 'codex', ...config });
  }

  getOutputDir(projectRoot) {
    return projectRoot;
  }

  async detect(projectRoot) {
    const codexMd = path.join(projectRoot, 'codex.md');
    const codexDir = path.join(projectRoot, '.codex');
    return (await fs.pathExists(codexMd)) || (await fs.pathExists(codexDir));
  }

  /**
   * Install compiled content as a single codex.md in project root
   * @param {string} projectRoot
   * @param {Object} compiled - { core, plugins, specs, designLanguage, config }
   * @returns {Promise<string[]>} List of files created/updated
   */
  async install(projectRoot, compiled) {
    const filePath = path.join(projectRoot, 'codex.md');
    const content = this._buildInstructions(compiled);
    await fs.writeFile(filePath, content, 'utf-8');
    return [filePath];
  }

  async uninstall(projectRoot) {
    const removed = [];
    const filePath = path.join(this.getOutputDir(projectRoot), 'codex.md');

    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
      removed.push(filePath);
    }

    return removed;
  }

  /**
   * Build the complete codex.md content
   * @private
   */
  _buildInstructions(compiled) {
    const { core, plugins } = compiled;
    const lines = [];

    lines.push('# AI Visualization');
    lines.push('');
    lines.push('When the user asks to create diagrams, architecture diagrams, sequence diagrams, flowcharts, or mentions drawio/excalidraw/mermaid, follow these instructions.');
    lines.push('');

    // Core methodology
    lines.push('## Core Methodology');
    lines.push('');
    lines.push(core.methodology);
    lines.push('');

    // Diagram type routing
    lines.push('## Diagram Type Routing');
    lines.push('');
    lines.push(core.routing);
    lines.push('');

    // Quality control
    lines.push('## Quality Control');
    lines.push('');
    lines.push(core.quality);
    lines.push('');

    // Plugins (all merged into one file)
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

    // Design language
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

module.exports = CodexAdapter;
