'use strict';

const RuleAdapter = require('./rule');

/**
 * Adapter for Windsurf IDE.
 * Output target: .windsurf/rules/
 *
 * Uses .md files with `trigger` frontmatter field.
 */
class WindsurfAdapter extends RuleAdapter {
  constructor(config = {}) {
    super('Windsurf', {
      toolId: 'windsurf',
      outputDirSegments: ['.windsurf', 'rules'],
      detectPaths: ['.windsurf', '.windsurfrules'],
      fileExtension: '.md',
      frontmatterField: 'trigger',
      coreTriggerValue: 'always',
      pluginTriggerValue: 'model_decision',
      ...config,
    });
  }
}

module.exports = WindsurfAdapter;
