'use strict';

const fs = require('fs');
const path = require('path');

/**
 * List of known AI coding tools and their detection strategies.
 */
const TOOLS = [
  { id: 'claude-code', markers: ['CLAUDE.md', '.claude'] },
  { id: 'cursor', markers: ['.cursorrules', '.cursor'] },
  { id: 'windsurf', markers: ['.windsurfrules', '.windsurf'] },
  { id: 'opencode', markers: ['.opencode'] },
  { id: 'copilot', markers: ['.github/copilot-instructions.md'] },
  { id: 'aider', markers: ['.aider.conf.yml', '.aiderignore'] },
  { id: 'qoder', markers: ['.qoder'] },
  { id: 'codex', markers: ['codex.md', '.codex'] },
  { id: 'trae', markers: ['.trae'] },
  { id: 'codebuddy', markers: ['.codebuddy'] },
];

/**
 * Detect which AI coding tool is being used in the given project directory.
 *
 * @param {string} projectPath - Path to the project root
 * @returns {string|null} The detected tool ID, or null if none detected
 */
function detectTool(projectPath) {
  for (const tool of TOOLS) {
    for (const marker of tool.markers) {
      const fullPath = path.join(projectPath, marker);
      if (fs.existsSync(fullPath)) {
        return tool.id;
      }
    }
  }
  return null;
}

/**
 * Get all supported tool IDs.
 * @returns {string[]}
 */
function getSupportedTools() {
  return TOOLS.map((t) => t.id);
}

module.exports = { detectTool, getSupportedTools };
