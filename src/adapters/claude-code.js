'use strict';

const SkillAdapter = require('./skill');

/**
 * Adapter for Claude Code (Anthropic).
 * Output target: .claude/skills/ai-viz/
 *
 * Native skill support: SKILL.md + separate plugin files.
 */
class ClaudeCodeAdapter extends SkillAdapter {
  constructor(config = {}) {
    super('Claude Code', {
      toolId: 'claude-code',
      outputDirSegments: ['.claude', 'skills', 'ai-viz'],
      detectPaths: ['.claude', 'CLAUDE.md'],
      ...config,
    });
  }
}

module.exports = ClaudeCodeAdapter;
