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
 * Remove a plugin from the current project.
 *
 * @param {string} plugin - Plugin name to remove (e.g. drawio, excalidraw, mermaid)
 */
module.exports = async function remove(plugin) {
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

    // 2. Check if plugin is in config
    if (!config.plugins || !config.plugins.includes(plugin)) {
      console.error(chalk.red(`✗ 插件 "${plugin}" 不在当前配置中`));
      if (config.plugins && config.plugins.length > 0) {
        console.log(chalk.gray(`  当前已安装插件: ${config.plugins.join(', ')}`));
      }
      process.exitCode = 1;
      return;
    }

    // 3. Remove from config
    config.plugins = config.plugins.filter(p => p !== plugin);
    await fs.writeJson(configPath, config, { spaces: 2 });
    console.log(chalk.green(`✓ 已移除插件: ${plugin}`));

    // 4. Re-compile and install (overwrite old files)
    console.log(chalk.blue('📦 重新编译中...'));
    const compiler = new Compiler(projectRoot);
    const compiled = compiler.compile();

    // Determine which adapter(s) to use
    const tools = config.tools || [config.tool];
    for (const toolId of tools) {
      if (toolId === 'multi') continue;
      if (!ADAPTERS[toolId]) continue;
      const AdapterClass = ADAPTERS[toolId]();
      const adapter = new AdapterClass();
      const files = await adapter.install(projectRoot, compiled);
      console.log(chalk.green(`✓ 已更新 ${adapter.name} (${files.length} 个文件)`));
    }

    console.log(chalk.green.bold('\n✅ 插件移除完成！'));
  } catch (err) {
    console.error(chalk.red(`\n✗ 移除插件失败: ${err.message}`));
    process.exitCode = 1;
  }
};
