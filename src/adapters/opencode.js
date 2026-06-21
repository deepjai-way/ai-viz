'use strict';

const SkillAdapter = require('./skill');

/**
 * Adapter for OpenCode.
 * Output target: .opencode/skills/ai-viz/
 *
 * Native skill support: SKILL.md + separate plugin files.
 * (Previously used .opencode/agents/ — migrated to skill format for
 * consistency with Claude Code and Qoder.)
 */
class OpenCodeAdapter extends SkillAdapter {
  constructor(config = {}) {
    super('OpenCode', {
      toolId: 'opencode',
      outputDirSegments: ['.opencode', 'skills', 'ai-viz'],
      detectPaths: ['.opencode', 'opencode.json'],
      ...config,
    });
  }
}

module.exports = OpenCodeAdapter;
