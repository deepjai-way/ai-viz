'use strict';

const fs = require('fs-extra');
const path = require('path');
const BaseAdapter = require('./base');

/**
 * RuleAdapter - Base class for IDE-based tools that use rule files.
 *
 * Output format: frontmatter + self-contained markdown files (one core +
 * one per plugin). Used by Cursor, Windsurf, Trae, CodeBuddy.
 *
 * Subclasses only need to provide config: outputDirSegments, detectPaths,
 * fileExtension, frontmatterField, pluginTriggerValue, and description strings.
 */
class RuleAdapter extends BaseAdapter {
  constructor(name, config = {}) {
    super(name, { toolId: name.toLowerCase().replace(/\s+/g, '-'), ...config });

    this.outputDirSegments = config.outputDirSegments || [];
    this.detectPaths = config.detectPaths || [];

    this.fileExtension = config.fileExtension || '.md';
    this.frontmatterField = config.frontmatterField || 'trigger';
    this.coreTriggerValue = config.coreTriggerValue || 'always';
    this.pluginTriggerValue = config.pluginTriggerValue || 'auto';

    this.coreDescription =
      config.coreDescription || 'AI Visualization - core methodology';
    this.pluginDescriptionTemplate =
      config.pluginDescriptionTemplate ||
      ((displayName) => `AI Visualization - ${displayName} diagram generation`);
  }

  getOutputDir(projectRoot) {
    return path.join(projectRoot, ...this.outputDirSegments);
  }

  async detect(projectRoot) {
    for (const p of this.detectPaths) {
      if (await fs.pathExists(path.join(projectRoot, p))) return true;
    }
    return false;
  }

  async install(projectRoot, compiled) {
    const outputDir = await this.ensureOutputDir(projectRoot);
    const createdFiles = [];

    const coreContent = this._buildCoreRule(compiled);
    createdFiles.push(
      await this.writeFile(
        path.join(outputDir, `ai-viz-core${this.fileExtension}`),
        coreContent
      )
    );

    for (const plugin of compiled.plugins) {
      const pluginContent = this._buildPluginRule(plugin, compiled);
      createdFiles.push(
        await this.writeFile(
          path.join(outputDir, `ai-viz-${plugin.name}${this.fileExtension}`),
          pluginContent
        )
      );
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

  _buildFrontmatter(triggerValue, description) {
    const lines = ['---'];
    lines.push(`${this.frontmatterField}: ${triggerValue}`);
    lines.push(`description: "${description}"`);
    lines.push('---');
    return lines.join('\n');
  }

  _buildCoreRule(compiled) {
    const { core, plugins } = compiled;
    const lines = [];

    lines.push(this._buildFrontmatter(this.coreTriggerValue, this.coreDescription));
    lines.push('');

    lines.push('# AI Visualization');
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

  _buildPluginRule(plugin, compiled) {
    const pj = plugin.pluginJson;
    const displayName = pj.displayName || plugin.name;
    const lines = [];

    lines.push(
      this._buildFrontmatter(
        this.pluginTriggerValue,
        this.pluginDescriptionTemplate(displayName)
      )
    );
    lines.push('');

    lines.push(`# ${displayName}`);
    lines.push('');

    if (plugin.instructions) {
      lines.push(plugin.instructions);
      lines.push('');
    }

    if (plugin.schema) {
      lines.push('---');
      lines.push('');
      lines.push(plugin.schema);
      lines.push('');
    }

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

module.exports = RuleAdapter;
