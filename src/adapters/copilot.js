'use strict';

const fs = require('fs-extra');
const path = require('path');
const BaseAdapter = require('./base');

/**
 * Adapter for GitHub Copilot.
 * Output target: .github/
 *
 * Generates or appends to .github/copilot-instructions.md
 */
class CopilotAdapter extends BaseAdapter {
  constructor(config = {}) {
    super('GitHub Copilot', { toolId: 'copilot', ...config });
  }

  getOutputDir(projectRoot) {
    return path.join(projectRoot, '.github');
  }

  async detect(projectRoot) {
    const githubDir = path.join(projectRoot, '.github');
    const copilotInstructions = path.join(githubDir, 'copilot-instructions.md');
    return (await fs.pathExists(githubDir)) || (await fs.pathExists(copilotInstructions));
  }

  /**
   * Install compiled content as Copilot instructions
   * @param {string} projectRoot
   * @param {Object} compiled - { core, plugins, specs, designLanguage, config }
   * @returns {Promise<string[]>} List of files created/updated
   */
  async install(projectRoot, compiled) {
    const outputDir = await this.ensureOutputDir(projectRoot);
    const createdFiles = [];

    const instructionsPath = path.join(outputDir, 'copilot-instructions.md');
    const aiVizContent = this._buildInstructions(compiled);

    // Check if copilot-instructions.md already exists
    if (await fs.pathExists(instructionsPath)) {
      let existingContent = await fs.readFile(instructionsPath, 'utf-8');

      // Remove old ai-viz section if present
      const startMarker = '<!-- ai-viz:start -->';
      const endMarker = '<!-- ai-viz:end -->';
      const startIdx = existingContent.indexOf(startMarker);
      const endIdx = existingContent.indexOf(endMarker);

      if (startIdx !== -1 && endIdx !== -1) {
        existingContent =
          existingContent.substring(0, startIdx) +
          existingContent.substring(endIdx + endMarker.length);
      }

      // Append ai-viz section
      const finalContent = existingContent.trimEnd() + '\n\n' + aiVizContent;
      await fs.writeFile(instructionsPath, finalContent, 'utf-8');
    } else {
      await fs.writeFile(instructionsPath, aiVizContent, 'utf-8');
    }

    createdFiles.push(instructionsPath);
    return createdFiles;
  }

  async uninstall(projectRoot) {
    const removed = [];
    const instructionsPath = path.join(this.getOutputDir(projectRoot), 'copilot-instructions.md');

    if (await fs.pathExists(instructionsPath)) {
      let content = await fs.readFile(instructionsPath, 'utf-8');
      const startMarker = '<!-- ai-viz:start -->';
      const endMarker = '<!-- ai-viz:end -->';
      const startIdx = content.indexOf(startMarker);
      const endIdx = content.indexOf(endMarker);

      if (startIdx !== -1 && endIdx !== -1) {
        content =
          content.substring(0, startIdx) +
          content.substring(endIdx + endMarker.length);
        content = content.trim();

        if (content.length === 0) {
          await fs.remove(instructionsPath);
        } else {
          await fs.writeFile(instructionsPath, content + '\n', 'utf-8');
        }
        removed.push(instructionsPath);
      }
    }

    return removed;
  }

  /**
   * Build ai-viz section for copilot-instructions.md
   * @private
   */
  _buildInstructions(compiled) {
    const { core, plugins } = compiled;
    const lines = [];

    lines.push('<!-- ai-viz:start -->');
    lines.push('');
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

    // Plugins
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

    lines.push('<!-- ai-viz:end -->');

    return lines.join('\n');
  }
}

module.exports = CopilotAdapter;
