'use strict';

const fs = require('fs-extra');
const path = require('path');
const BaseAdapter = require('./base');

/**
 * Adapter for Aider.
 * Output target: .ai-viz/
 *
 * Generates:
 * - .ai-viz/instructions.md - Complete instructions file
 * - Suggests user to add `read: .ai-viz/instructions.md` to .aider.conf.yml
 */
class AiderAdapter extends BaseAdapter {
  constructor(config = {}) {
    super('Aider', { toolId: 'aider', ...config });
  }

  getOutputDir(projectRoot) {
    return path.join(projectRoot, '.ai-viz');
  }

  async detect(projectRoot) {
    const aiderConf = path.join(projectRoot, '.aider.conf.yml');
    const aiderConfYaml = path.join(projectRoot, '.aider.conf.yaml');
    const aiderIgnore = path.join(projectRoot, '.aiderignore');
    return (
      (await fs.pathExists(aiderConf)) ||
      (await fs.pathExists(aiderConfYaml)) ||
      (await fs.pathExists(aiderIgnore))
    );
  }

  /**
   * Install compiled content as Aider instructions
   * @param {string} projectRoot
   * @param {Object} compiled - { core, plugins, specs, designLanguage, config }
   * @returns {Promise<string[]>} List of files created
   */
  async install(projectRoot, compiled) {
    const outputDir = await this.ensureOutputDir(projectRoot);
    const createdFiles = [];

    // 1. Generate complete instructions file
    const instructionsContent = this._buildInstructions(compiled);
    createdFiles.push(await this.writeFile(
      path.join(outputDir, 'instructions.md'),
      instructionsContent
    ));

    // 2. Check if .aider.conf.yml exists and suggest adding read directive
    const aiderConfPath = path.join(projectRoot, '.aider.conf.yml');
    if (await fs.pathExists(aiderConfPath)) {
      const content = await fs.readFile(aiderConfPath, 'utf-8');
      if (!content.includes('.ai-viz/instructions.md')) {
        // Append read directive
        const directive = '\nread: .ai-viz/instructions.md\n';
        await fs.appendFile(aiderConfPath, directive);
        createdFiles.push(aiderConfPath);
      }
    } else {
      // Create minimal .aider.conf.yml with read directive
      const confContent = '# Aider configuration\nread: .ai-viz/instructions.md\n';
      await fs.writeFile(aiderConfPath, confContent, 'utf-8');
      createdFiles.push(aiderConfPath);
    }

    return createdFiles;
  }

  async uninstall(projectRoot) {
    const removed = [];
    const outputDir = this.getOutputDir(projectRoot);

    if (await fs.pathExists(outputDir)) {
      const files = await fs.readdir(outputDir);
      for (const file of files) {
        removed.push(path.join(outputDir, file));
      }
      await fs.remove(outputDir);
    }

    // Remove read directive from .aider.conf.yml
    const aiderConfPath = path.join(projectRoot, '.aider.conf.yml');
    if (await fs.pathExists(aiderConfPath)) {
      let content = await fs.readFile(aiderConfPath, 'utf-8');
      const originalContent = content;
      content = content.replace(/\nread: \.ai-viz\/instructions\.md\n?/g, '\n');
      content = content.replace(/^read: \.ai-viz\/instructions\.md\n?/gm, '');
      if (content !== originalContent) {
        await fs.writeFile(aiderConfPath, content.trim() + '\n', 'utf-8');
      }
    }

    return removed;
  }

  /**
   * Build complete instructions markdown
   * @private
   */
  _buildInstructions(compiled) {
    const { core, plugins } = compiled;
    const lines = [];

    lines.push('# AI Visualization Instructions');
    lines.push('');
    lines.push('When asked to create diagrams, architecture diagrams, sequence diagrams, flowcharts,');
    lines.push('or when drawio/excalidraw/mermaid is mentioned, follow these instructions.');
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

    return lines.join('\n');
  }
}

module.exports = AiderAdapter;
