'use strict';

const fs = require('fs-extra');
const path = require('path');
const BaseAdapter = require('./base');

const DEFAULT_SKILL_DESCRIPTION =
  'AI 可视化 - 从知识源自动生成专业图表与配图（DrawIO/Excalidraw/Mermaid/ian-illustrator）。触发词：画图、架构图、时序图、流程图、drawio、excalidraw、可视化、配图。';

/**
 * SkillAdapter - Base class for tools that natively support the skill mechanism.
 *
 * Output format: SKILL.md (with YAML frontmatter) + separate plugin files
 * + design-language.yaml. Used by Claude Code, OpenCode, Qoder.
 *
 * Subclasses only need to provide config: outputDirSegments, detectPaths,
 * and optional frontmatter overrides (triggers, description).
 */
class SkillAdapter extends BaseAdapter {
  constructor(name, config = {}) {
    super(name, { toolId: name.toLowerCase().replace(/\s+/g, '-'), ...config });

    this.outputDirSegments = config.outputDirSegments || ['skills', 'ai-viz'];
    this.detectPaths = config.detectPaths || [];

    this.skillName = config.skillName || 'ai-viz';
    this.skillDescription = config.skillDescription || DEFAULT_SKILL_DESCRIPTION;
    this.triggers = config.triggers || null;
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
    const outputDir = this.getOutputDir(projectRoot);

    if (await fs.pathExists(outputDir)) {
      await fs.emptyDir(outputDir);
    } else {
      await fs.ensureDir(outputDir);
    }

    const createdFiles = [];

    const skillContent = this._buildSkillMd(compiled);
    createdFiles.push(await this.writeFile(path.join(outputDir, 'SKILL.md'), skillContent));

    for (const plugin of compiled.plugins) {
      if (plugin.instructions) {
        createdFiles.push(
          await this.writeFile(
            path.join(outputDir, `${plugin.name}-instructions.md`),
            plugin.instructions
          )
        );
      }
      if (plugin.schema) {
        createdFiles.push(
          await this.writeFile(
            path.join(outputDir, `${plugin.name}-schema.md`),
            plugin.schema
          )
        );
      }
    }

    if (compiled.designLanguage) {
      createdFiles.push(
        await this.writeFile(
          path.join(outputDir, 'design-language.yaml'),
          compiled.designLanguage
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
        removed.push(path.join(outputDir, file));
      }
      await fs.remove(outputDir);
    }
    return removed;
  }

  _buildFrontmatter() {
    const lines = ['---'];
    lines.push(`name: ${this.skillName}`);
    lines.push(`description: "${this.skillDescription}"`);
    if (this.triggers && this.triggers.length > 0) {
      lines.push('triggers:');
      for (const t of this.triggers) {
        lines.push(`  - ${t}`);
      }
    }
    lines.push('---');
    return lines.join('\n');
  }

  _buildSkillMd(compiled) {
    const { core, plugins } = compiled;
    const lines = [];

    lines.push(this._buildFrontmatter());
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
        lines.push(`### ${displayName}`);
        lines.push(`- **Name**: ${plugin.name}`);
        lines.push(`- **Description**: ${pj.description || ''}`);
        if (pj.triggers) {
          const triggers = pj.triggers.en || pj.triggers.zh || [];
          lines.push(`- **Triggers**: ${triggers.join(', ')}`);
        }
        lines.push('');
      }

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

    if (compiled.designLanguage) {
      lines.push('## Design Language');
      lines.push('');
      lines.push('See `design-language.yaml` for project-specific color scheme and layout configuration.');
      lines.push('');
    }

    return lines.join('\n');
  }
}

module.exports = SkillAdapter;
