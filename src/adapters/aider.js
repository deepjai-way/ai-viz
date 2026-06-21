'use strict';

const fs = require('fs-extra');
const path = require('path');
const InstructionsAdapter = require('./instructions');

const READ_DIRECTIVE = 'read: .ai-viz/instructions.md';

/**
 * Adapter for Aider.
 * Output target: .ai-viz/instructions.md
 *
 * Also creates/updates .aider.conf.yml with a `read:` directive so Aider
 * loads the instructions file automatically.
 */
class AiderAdapter extends InstructionsAdapter {
  constructor(config = {}) {
    super('Aider', {
      toolId: 'aider',
      title: '# AI Visualization Instructions',
      intro:
        'When asked to create diagrams, architecture diagrams, sequence diagrams, flowcharts, or when drawio/excalidraw/mermaid is mentioned, follow these instructions.',
      ...config,
    });
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

  async install(projectRoot, compiled) {
    const outputDir = await this.ensureOutputDir(projectRoot);
    const createdFiles = [];

    const instructionsContent = this._buildInstructions(compiled);
    createdFiles.push(
      await this.writeFile(
        path.join(outputDir, 'instructions.md'),
        instructionsContent
      )
    );

    const aiderConfPath = path.join(projectRoot, '.aider.conf.yml');
    if (await fs.pathExists(aiderConfPath)) {
      const content = await fs.readFile(aiderConfPath, 'utf-8');
      if (!content.includes(READ_DIRECTIVE)) {
        const directive = `\n${READ_DIRECTIVE}\n`;
        await fs.appendFile(aiderConfPath, directive);
        createdFiles.push(aiderConfPath);
      }
    } else {
      const confContent = `# Aider configuration\n${READ_DIRECTIVE}\n`;
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

    const aiderConfPath = path.join(projectRoot, '.aider.conf.yml');
    if (await fs.pathExists(aiderConfPath)) {
      let content = await fs.readFile(aiderConfPath, 'utf-8');
      const originalContent = content;
      content = content.replace(
        new RegExp(`\\n${READ_DIRECTIVE.replace(/\./g, '\\.')}\\n?`, 'g'),
        '\n'
      );
      content = content.replace(
        new RegExp(`^${READ_DIRECTIVE.replace(/\./g, '\\.')}\\n?`, 'gm'),
        ''
      );
      if (content !== originalContent) {
        await fs.writeFile(aiderConfPath, content.trim() + '\n', 'utf-8');
      }
    }

    return removed;
  }
}

module.exports = AiderAdapter;
