'use strict';

const SkillAdapter = require('./skill');

/**
 * Adapter for Qoder.
 * Output target: skills/ai-viz/
 *
 * Native skill support: SKILL.md + separate plugin files.
 * Includes trigger words in frontmatter.
 */
class QoderAdapter extends SkillAdapter {
  constructor(config = {}) {
    super('Qoder', {
      toolId: 'qoder',
      outputDirSegments: ['skills', 'ai-viz'],
      detectPaths: ['skills', '.qoder'],
      triggers: [
        '画图',
        '架构图',
        '时序图',
        '流程图',
        'drawio',
        'excalidraw',
        'mermaid',
        '可视化',
      ],
      ...config,
    });
  }
}

module.exports = QoderAdapter;
