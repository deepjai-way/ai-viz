'use strict';

const fs = require('fs-extra');
const path = require('path');
const BaseAdapter = require('./base');

/**
 * Adapter for OpenCode.
 * Output target: .opencode/
 *
 * Generates:
 * - .opencode/agents/ai-viz.md - Agent definition file
 * - Updates/creates opencode.json reference
 */
class OpenCodeAdapter extends BaseAdapter {
  constructor(config = {}) {
    super('OpenCode', { toolId: 'opencode', ...config });
  }

  getOutputDir(projectRoot) {
    return path.join(projectRoot, '.opencode');
  }

  async detect(projectRoot) {
    const opencodeDir = path.join(projectRoot, '.opencode');
    const opencodeJson = path.join(projectRoot, 'opencode.json');
    return (await fs.pathExists(opencodeDir)) || (await fs.pathExists(opencodeJson));
  }

  /**
   * Install compiled content as OpenCode agent definition
   * @param {string} projectRoot
   * @param {Object} compiled - { core, plugins, specs, designLanguage, config }
   * @returns {Promise<string[]>} List of files created
   */
  async install(projectRoot, compiled) {
    const outputDir = await this.ensureOutputDir(projectRoot);
    const createdFiles = [];

    // 1. Generate agent definition file
    const agentContent = this._buildAgentMd(compiled);
    const agentDir = path.join(outputDir, 'agents');
    await fs.ensureDir(agentDir);
    createdFiles.push(await this.writeFile(
      path.join(agentDir, 'ai-viz.md'),
      agentContent
    ));

    // 2. Update/create opencode.json
    const opencodeJsonPath = path.join(projectRoot, 'opencode.json');
    await this._updateOpencodeJson(opencodeJsonPath);
    createdFiles.push(opencodeJsonPath);

    return createdFiles;
  }

  async uninstall(projectRoot) {
    const removed = [];
    const agentFile = path.join(this.getOutputDir(projectRoot), 'agents', 'ai-viz.md');
    if (await fs.pathExists(agentFile)) {
      await fs.remove(agentFile);
      removed.push(agentFile);
    }

    // Remove reference from opencode.json
    const opencodeJsonPath = path.join(projectRoot, 'opencode.json');
    if (await fs.pathExists(opencodeJsonPath)) {
      try {
        const json = await fs.readJson(opencodeJsonPath);
        if (json.agents && json.agents['ai-viz']) {
          delete json.agents['ai-viz'];
          await fs.writeJson(opencodeJsonPath, json, { spaces: 2 });
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    }

    return removed;
  }

  /**
   * Build the agent markdown file
   * @private
   */
  _buildAgentMd(compiled) {
    const { core, plugins } = compiled;
    const lines = [];

    // Agent header
    lines.push('# AI Visualization Agent');
    lines.push('');
    lines.push('An AI agent specialized in generating professional diagrams from knowledge sources.');
    lines.push('Supports DrawIO, Excalidraw, and Mermaid formats.');
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

  /**
   * Update or create opencode.json with ai-viz agent reference
   * @private
   */
  async _updateOpencodeJson(jsonPath) {
    let json = {};
    if (await fs.pathExists(jsonPath)) {
      try {
        json = await fs.readJson(jsonPath);
      } catch (e) {
        json = {};
      }
    }

    if (!json.agents) {
      json.agents = {};
    }

    json.agents['ai-viz'] = {
      path: '.opencode/agents/ai-viz.md',
      description: 'AI Visualization - Generate professional diagrams and illustrations from knowledge sources',
    };

    await fs.writeJson(jsonPath, json, { spaces: 2 });
  }
}

module.exports = OpenCodeAdapter;
