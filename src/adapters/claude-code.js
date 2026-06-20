'use strict';

const fs = require('fs-extra');
const path = require('path');
const BaseAdapter = require('./base');

/**
 * Adapter for Claude Code (Anthropic).
 * Output target: .claude/skills/ai-viz/
 *
 * Generates multi-file structure with SKILL.md as the main entry point
 * and separate files for each plugin's instructions and schema.
 */
class ClaudeCodeAdapter extends BaseAdapter {
  constructor(config = {}) {
    super('Claude Code', { toolId: 'claude-code', ...config });
  }

  getOutputDir(projectRoot) {
    return path.join(projectRoot, '.claude', 'skills', 'ai-viz');
  }

  async detect(projectRoot) {
    const claudeDir = path.join(projectRoot, '.claude');
    const claudeMd = path.join(projectRoot, 'CLAUDE.md');
    return (await fs.pathExists(claudeDir)) || (await fs.pathExists(claudeMd));
  }

  /**
   * Install compiled content as Claude Code skills
   * @param {string} projectRoot
   * @param {Object} compiled - { core, plugins, specs, designLanguage, config }
   * @returns {Promise<string[]>} List of files created
   */
  async install(projectRoot, compiled) {
    const outputDir = this.getOutputDir(projectRoot);

    // Clean output directory to remove stale files from removed plugins
    if (await fs.pathExists(outputDir)) {
      await fs.emptyDir(outputDir);
    } else {
      await fs.ensureDir(outputDir);
    }

    const createdFiles = [];

    // 1. Generate SKILL.md (main entry)
    const skillContent = this._buildSkillMd(compiled);
    createdFiles.push(await this.writeFile(path.join(outputDir, 'SKILL.md'), skillContent));

    // 2. Generate plugin files
    for (const plugin of compiled.plugins) {
      // Instructions file
      if (plugin.instructions) {
        const instrFile = `${plugin.name}-instructions.md`;
        createdFiles.push(await this.writeFile(path.join(outputDir, instrFile), plugin.instructions));
      }

      // Schema file
      if (plugin.schema) {
        const schemaFile = `${plugin.name}-schema.md`;
        createdFiles.push(await this.writeFile(path.join(outputDir, schemaFile), plugin.schema));
      }
    }

    // 3. Copy design language if available
    if (compiled.designLanguage) {
      createdFiles.push(await this.writeFile(
        path.join(outputDir, 'design-language.yaml'),
        compiled.designLanguage
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
        removed.push(path.join(outputDir, file));
      }
      await fs.remove(outputDir);
    }
    return removed;
  }

  /**
   * Build the main SKILL.md content
   * @private
   */
  _buildSkillMd(compiled) {
    const { core, plugins, config } = compiled;
    const lines = [];

    // Frontmatter
    lines.push('---');
    lines.push('name: ai-viz');
    lines.push('description: "AI 可视化 - 从知识源自动生成专业图表与配图（DrawIO/Excalidraw/Mermaid/ian-illustrator）。触发词：画图、架构图、时序图、流程图、drawio、excalidraw、可视化、配图。"');
    lines.push('---');
    lines.push('');

    // Title
    lines.push('# AI Visualization');
    lines.push('');

    // Core methodology (condensed)
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

    // Available plugins
    if (plugins && plugins.length > 0) {
      lines.push('## Available Plugins');
      lines.push('');
      for (const plugin of plugins) {
        const pj = plugin.pluginJson;
        const displayName = pj.displayName || plugin.name;
        lines.push(`### ${displayName}`);
        lines.push(`- **Name**: ${plugin.name}`);
        lines.push(`- **Description**: ${pj.description || ''}`);
        if (pj.triggers) {
          const triggers = pj.triggers.en || pj.triggers.zh || [];
          lines.push(`- **Triggers**: ${triggers.join(', ')}`);
        }
        lines.push('');
      }

      // Plugin file references
      lines.push('## Plugin Instructions');
      lines.push('');
      lines.push('See the following files for format-specific instructions:');
      for (const plugin of plugins) {
        if (plugin.instructions) {
          lines.push(`- ${plugin.name}-instructions.md`);
        }
        if (plugin.schema) {
          lines.push(`- ${plugin.name}-schema.md`);
        }
      }
      lines.push('');
    }

    // Design language reference
    if (compiled.designLanguage) {
      lines.push('## Design Language');
      lines.push('');
      lines.push('See `design-language.yaml` for project-specific color scheme and layout configuration.');
      lines.push('');
    }

    return lines.join('\n');
  }
}

module.exports = ClaudeCodeAdapter;
