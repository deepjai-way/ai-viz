'use strict';

const RuleAdapter = require('./rule');

/**
 * Adapter for Trae IDE (ByteDance AI IDE).
 * Output target: .trae/rules/
 *
 * Uses .md files with `trigger` frontmatter field.
 */
class TraeAdapter extends RuleAdapter {
  constructor(config = {}) {
    super('Trae', {
      toolId: 'trae',
      outputDirSegments: ['.trae', 'rules'],
      detectPaths: ['.trae'],
      fileExtension: '.md',
      frontmatterField: 'trigger',
      coreTriggerValue: 'always',
      pluginTriggerValue: 'auto',
      ...config,
    });
  }
}

module.exports = TraeAdapter;
