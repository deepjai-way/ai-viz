'use strict';

const RuleAdapter = require('./rule');

/**
 * Adapter for CodeBuddy (Tencent AI Assistant).
 * Output target: .codebuddy/rules/
 *
 * Uses .md files with `type` frontmatter field (instead of `trigger`).
 */
class CodeBuddyAdapter extends RuleAdapter {
  constructor(config = {}) {
    super('CodeBuddy', {
      toolId: 'codebuddy',
      outputDirSegments: ['.codebuddy', 'rules'],
      detectPaths: ['.codebuddy'],
      fileExtension: '.md',
      frontmatterField: 'type',
      coreTriggerValue: 'always',
      pluginTriggerValue: 'context',
      coreDescription: 'AI 可视化 - 核心方法论',
      pluginDescriptionTemplate: (displayName) =>
        `AI 可视化 - ${displayName} 图表生成`,
      ...config,
    });
  }
}

module.exports = CodeBuddyAdapter;
