'use strict';

const fs = require('fs-extra');
const path = require('path');
const BaseAdapter = require('./base');

/**
 * Adapter for Windsurf IDE.
 * Output target: .windsurf/rules/
 *
 * Similar to Cursor but uses .md extension and 'model_decision' trigger.
 * Each file is self-contained.
 */
class WindsurfAdapter extends BaseAdapter {
  constructor(config = {}) {
    super('Windsurf', { toolId: 'windsurf', ...config });
  }

  getOutputDir(projectRoot) {
    return path.join(projectRoot, '.windsurf', 'rules');
  }

  async detect(projectRoot) {
    const windsurfDir = path.join(projectRoot, '.windsurf');
    const windsurfRules = path.join(projectRoot, '.windsurfrules');
    return (await fs.pathExists(windsurfDir)) || (await fs.pathExists(windsurfRules));
  }

  /**
   * Install compiled content as Windsurf rules (.md files)
   * @param {string} projectRoot
   * @param {Object} compiled - { core, plugins, specs, designLanguage, config }
   * @returns {Promise<string[]>} List of files created
   */
  async install(projectRoot, compiled) {
    const outputDir = await this.ensureOutputDir(projectRoot);
    const createdFiles = [];

    // 1. Core rule file (trigger: always)
    const coreContent = this._buildCoreRule(compiled);
    createdFiles.push(await this.writeFile(
      path.join(outputDir, 'ai-viz-core.md'),
      coreContent
    ));

    // 2. Plugin rule files (trigger: model_decision)
    for (const plugin of compiled.plugins) {
      const pluginContent = this._buildPluginRule(plugin, compiled);
      createdFiles.push(await this.writeFile(
        path.join(outputDir, `ai-viz-${plugin.name}.md`),
        pluginContent
      ));
    }

    return createdFiles;
  }

  async uninstall(projectRoot) {
    const outputDir = this.getOutputDir(projectRoot);
    const removed = [];
    if (await fs.pathExists(outputDir)) {
      const files = await fs.readdir(outputDir);
      for (const file of files) {
        if (file.startsWith('ai-viz-')) {
          const filePath = path.join(outputDir, file);
          removed.push(filePath);
          await fs.remove(filePath);
        }
      }
    }
    return removed;
  }

  /**
   * Build core rule file
   * @private
   */
  _buildCoreRule(compiled) {
    const { core, plugins } = compiled;
    const lines = [];

    // Frontmatter
    lines.push('---');
    lines.push('trigger: always');
    lines.push('description: "AI Visualization - core methodology and diagram routing"');
    lines.push('---');
    lines.push('');

    // Title
    lines.push('# AI Visualization');
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

    // Available plugins summary
    if (plugins && plugins.length > 0) {
      lines.push('## Available Plugins');
      lines.push('');
      for (const plugin of plugins) {
        const pj = plugin.pluginJson;
        const displayName = pj.displayName || plugin.name;
        const triggers = pj.triggers?.en?.join(', ') || '';
        lines.push(`- **${displayName}**: ${pj.description || ''} (triggers: ${triggers})`);
      }
      lines.push('');
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

  /**
   * Build plugin rule file (self-contained)
   * @private
   */
  _buildPluginRule(plugin, compiled) {
    const pj = plugin.pluginJson;
    const displayName = pj.displayName || plugin.name;
    const lines = [];

    // Frontmatter
    lines.push('---');
    lines.push('trigger: model_decision');
    lines.push(`description: "AI Visualization - ${displayName} diagram generation"`);
    lines.push('---');
    lines.push('');

    // Title
    lines.push(`# ${displayName}`);
    lines.push('');

    // Instructions (full content)
    if (plugin.instructions) {
      lines.push(plugin.instructions);
      lines.push('');
    }

    // Schema (merged into the same file)
    if (plugin.schema) {
      lines.push('---');
      lines.push('');
      lines.push(plugin.schema);
      lines.push('');
    }

    // Design language (inline for self-containment)
    if (compiled.designLanguage) {
      lines.push('## Design Language Configuration');
      lines.push('');
      lines.push('```yaml');
      lines.push(compiled.designLanguage);
      lines.push('```');
      lines.push('');
    }

    return lines.join('\n');
  }
}

module.exports = WindsurfAdapter;
