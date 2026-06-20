'use strict';

const fs = require('fs-extra');
const path = require('path');
const BaseAdapter = require('./base');

/**
 * Adapter for CodeBuddy (Tencent AI Assistant).
 * Output target: .codebuddy/rules/
 *
 * Uses .md files with YAML frontmatter. Uses 'type' field instead of 'trigger'.
 * Each file is self-contained.
 */
class CodeBuddyAdapter extends BaseAdapter {
  constructor(config = {}) {
    super('CodeBuddy', { toolId: 'codebuddy', ...config });
  }

  getOutputDir(projectRoot) {
    return path.join(projectRoot, '.codebuddy', 'rules');
  }

  async detect(projectRoot) {
    const codebuddyDir = path.join(projectRoot, '.codebuddy');
    return await fs.pathExists(codebuddyDir);
  }

  /**
   * Install compiled content as CodeBuddy rules (.md files)
   * @param {string} projectRoot
   * @param {Object} compiled - { core, plugins, specs, designLanguage, config }
   * @returns {Promise<string[]>} List of files created
   */
  async install(projectRoot, compiled) {
    const outputDir = await this.ensureOutputDir(projectRoot);
    const createdFiles = [];

    // 1. Core rule file (type: always)
    const coreContent = this._buildCoreRule(compiled);
    createdFiles.push(await this.writeFile(
      path.join(outputDir, 'ai-viz-core.md'),
      coreContent
    ));

    // 2. Plugin rule files (type: context)
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
    lines.push('type: always');
    lines.push('description: "AI 可视化 - 核心方法论"');
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
    lines.push('type: context');
    lines.push(`description: "AI 可视化 - ${displayName} 图表生成"`);
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

module.exports = CodeBuddyAdapter;
