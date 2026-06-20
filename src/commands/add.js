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
  'codex': () => require('../adapters/codex'),
  'qoder': () => require('../adapters/qoder'),
  'aider': () => require('../adapters/aider'),
  'trae': () => require('../adapters/trae'),
  'codebuddy': () => require('../adapters/codebuddy'),
};

/**
 * Add a plugin to the current project.
 *
 * @param {string} plugin - Plugin name to add (e.g. drawio, excalidraw, mermaid)
 */
module.exports = async function add(plugin) {
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

    // 2. Validate plugin exists
    const packageRoot = path.resolve(__dirname, '../..');
    const pluginDir = path.join(packageRoot, 'plugins', plugin);
    const pluginJsonPath = path.join(pluginDir, 'plugin.json');

    if (!await fs.pathExists(pluginJsonPath)) {
      const available = await fs.readdir(path.join(packageRoot, 'plugins'));
      const validPlugins = [];
      for (const dir of available) {
        if (await fs.pathExists(path.join(packageRoot, 'plugins', dir, 'plugin.json'))) {
          validPlugins.push(dir);
        }
      }
      console.error(chalk.red(`✗ 插件 "${plugin}" 不存在`));
      console.log(chalk.gray(`  可用插件: ${validPlugins.join(', ')}`));
      process.exitCode = 1;
      return;
    }

    // 3. Check if already added
    if (!config.plugins) {
      config.plugins = [];
    }
    if (config.plugins.includes(plugin)) {
      console.log(chalk.yellow(`⚠ 插件 "${plugin}" 已经在配置中`));
      return;
    }

    // 4. Add to config
    config.plugins.push(plugin);
    await fs.writeJson(configPath, config, { spaces: 2 });
    console.log(chalk.green(`✓ 已添加插件: ${plugin}`));

    // 5. Re-compile and install
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

    console.log(chalk.green.bold('\n✅ 插件添加完成！'));
  } catch (err) {
    console.error(chalk.red(`\n✗ 添加插件失败: ${err.message}`));
    process.exitCode = 1;
  }
};
