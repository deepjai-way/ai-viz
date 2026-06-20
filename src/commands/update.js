'use strict';

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { Compiler } = require('../compiler');

// Adapter map
const ADAPTERS = {
  'claude-code': () => require('../adapters/claude-code'),
  'cursor': () => require('../adapters/cursor'),
  'windsurf': () => require('../adapters/windsurf'),
  'opencode': () => require('../adapters/opencode'),
  'copilot': () => require('../adapters/copilot'),
  'qoder': () => require('../adapters/qoder'),
  'aider': () => require('../adapters/aider'),
};

/**
 * Re-compile and re-install instruction files.
 * Equivalent to a fresh install using current config.
 */
module.exports = async function update() {
  const projectRoot = process.cwd();

  try {
    // 1. Read existing config
    const configPath = path.join(projectRoot, 'ai-viz.config.json');
    if (!await fs.pathExists(configPath)) {
      console.error(chalk.red('✗ 未找到 ai-viz.config.json，请先运行 npx ai-viz init'));
      process.exitCode = 1;
      return;
    }

    const config = await fs.readJson(configPath);

    console.log(chalk.blue('📦 正在重新编译...'));
    console.log(chalk.gray(`  插件: ${(config.plugins || []).join(', ') || '无'}`));
    console.log(chalk.gray(`  语言: ${config.language || 'en'}`));

    // 2. Compile
    const compiler = new Compiler(projectRoot);
    const compiled = compiler.compile();

    // 3. Re-install for each configured tool
    const tools = config.tools || [config.tool];
    const allFiles = [];

    console.log(chalk.blue('📥 正在更新指令文件...'));
    for (const toolId of tools) {
      if (toolId === 'multi') continue;
      if (!ADAPTERS[toolId]) {
        console.log(chalk.yellow(`  ⚠ 未知工具: ${toolId}，跳过`));
        continue;
      }
      const AdapterClass = ADAPTERS[toolId]();
      const adapter = new AdapterClass();
      const files = await adapter.install(projectRoot, compiled);
      allFiles.push(...files);
      console.log(chalk.green(`  ✓ ${adapter.name} (${files.length} 个文件)`));
      for (const f of files) {
        console.log(chalk.gray(`    → ${path.relative(projectRoot, f)}`));
      }
    }

    console.log('');
    console.log(chalk.green.bold(`✅ 更新完成！共更新 ${allFiles.length} 个文件`));
  } catch (err) {
    console.error(chalk.red(`\n✗ 更新失败: ${err.message}`));
    process.exitCode = 1;
  }
};
