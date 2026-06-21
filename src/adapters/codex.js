'use strict';

const fs = require('fs-extra');
const path = require('path');
const InstructionsAdapter = require('./instructions');

/**
 * Adapter for OpenAI Codex CLI.
 * Output target: project root as codex.md
 *
 * Single-file design: all content merged into one markdown file.
 */
class CodexAdapter extends InstructionsAdapter {
  constructor(config = {}) {
    super('Codex', {
      toolId: 'codex',
      ...config,
    });
  }

  getOutputDir(projectRoot) {
    return projectRoot;
  }

  async detect(projectRoot) {
    const codexMd = path.join(projectRoot, 'codex.md');
    const codexDir = path.join(projectRoot, '.codex');
    return (await fs.pathExists(codexMd)) || (await fs.pathExists(codexDir));
  }

  async install(projectRoot, compiled) {
    const filePath = path.join(projectRoot, 'codex.md');
    const content = this._buildInstructions(compiled);
    await fs.writeFile(filePath, content, 'utf-8');
    return [filePath];
  }

  async uninstall(projectRoot) {
    const removed = [];
    const filePath = path.join(projectRoot, 'codex.md');

    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
      removed.push(filePath);
    }

    return removed;
  }
}

module.exports = CodexAdapter;
