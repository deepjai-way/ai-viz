'use strict';

const RuleAdapter = require('./rule');

/**
 * Adapter for Cursor IDE.
 * Output target: .cursor/rules/
 *
 * Uses .mdc files with `trigger` frontmatter field.
 */
class CursorAdapter extends RuleAdapter {
  constructor(config = {}) {
    super('Cursor', {
      toolId: 'cursor',
      outputDirSegments: ['.cursor', 'rules'],
      detectPaths: ['.cursor', '.cursorrules'],
      fileExtension: '.mdc',
      frontmatterField: 'trigger',
      coreTriggerValue: 'always',
      pluginTriggerValue: 'auto-attached',
      ...config,
    });
  }
}

module.exports = CursorAdapter;
