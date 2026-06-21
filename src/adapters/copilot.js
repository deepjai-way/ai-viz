'use strict';

const fs = require('fs-extra');
const path = require('path');
const InstructionsAdapter = require('./instructions');

const START_MARKER = '<!-- ai-viz:start -->';
const END_MARKER = '<!-- ai-viz:end -->';

/**
 * Adapter for GitHub Copilot.
 * Output target: .github/copilot-instructions.md
 *
 * Appends ai-viz section (wrapped in markers) to the instructions file.
 */
class CopilotAdapter extends InstructionsAdapter {
  constructor(config = {}) {
    super('GitHub Copilot', {
      toolId: 'copilot',
      ...config,
    });
  }

  getOutputDir(projectRoot) {
    return path.join(projectRoot, '.github');
  }

  async detect(projectRoot) {
    const githubDir = path.join(projectRoot, '.github');
    const copilotInstructions = path.join(githubDir, 'copilot-instructions.md');
    return (
      (await fs.pathExists(githubDir)) ||
      (await fs.pathExists(copilotInstructions))
    );
  }

  async install(projectRoot, compiled) {
    const outputDir = await this.ensureOutputDir(projectRoot);
    const createdFiles = [];

    const instructionsPath = path.join(outputDir, 'copilot-instructions.md');
    const aiVizContent = this._wrapWithMarkers(this._buildInstructions(compiled));

    if (await fs.pathExists(instructionsPath)) {
      let existingContent = await fs.readFile(instructionsPath, 'utf-8');

      const startIdx = existingContent.indexOf(START_MARKER);
      const endIdx = existingContent.indexOf(END_MARKER);

      if (startIdx !== -1 && endIdx !== -1) {
        existingContent =
          existingContent.substring(0, startIdx) +
          existingContent.substring(endIdx + END_MARKER.length);
      }

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
    const instructionsPath = path.join(
      this.getOutputDir(projectRoot),
      'copilot-instructions.md'
    );

    if (await fs.pathExists(instructionsPath)) {
      let content = await fs.readFile(instructionsPath, 'utf-8');
      const startIdx = content.indexOf(START_MARKER);
      const endIdx = content.indexOf(END_MARKER);

      if (startIdx !== -1 && endIdx !== -1) {
        content =
          content.substring(0, startIdx) +
          content.substring(endIdx + END_MARKER.length);
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

  _wrapWithMarkers(content) {
    return `${START_MARKER}\n\n${content}\n${END_MARKER}`;
  }
}

module.exports = CopilotAdapter;
