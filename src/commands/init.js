'use strict';

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { select, checkbox, confirm } = require('@inquirer/prompts');
const { Compiler } = require('../compiler');
const { detectTool } = require('../utils/detect-tool');

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

const TOOL_CHOICES = [
  { name: 'Claude Code', value: 'claude-code' },
  { name: 'Cursor', value: 'cursor' },
  { name: 'Windsurf', value: 'windsurf' },
  { name: 'OpenCode', value: 'opencode' },
  { name: 'GitHub Copilot', value: 'copilot' },
  { name: 'Codex (OpenAI)', value: 'codex' },
  { name: 'Qoder', value: 'qoder' },
  { name: 'Aider', value: 'aider' },
  { name: 'Trae', value: 'trae' },
  { name: 'CodeBuddy', value: 'codebuddy' },
  { name: '多工具 (Multi-tool)', value: 'multi' },
];

const PLUGIN_CHOICES = [
  { name: 'drawio - 专业正式图表，支持 PNG/SVG 导出', value: 'drawio' },
  { name: 'excalidraw - 手绘风格，适合内部讨论', value: 'excalidraw' },
  { name: 'mermaid - 轻量文本图表，适合 README', value: 'mermaid' },
];

const LANGUAGE_CHOICES = [
  { name: '中文 (zh-CN)', value: 'zh-CN' },
  { name: 'English (en)', value: 'en' },
  { name: '双语 (both)', value: 'both' },
];

/**
 * Initialize ai-viz configuration in the current project.
 */
module.exports = async function init() {
  const projectRoot = process.cwd();

  try {
    console.log('');
    console.log(chalk.blue.bold('🎨 AI-Viz 初始化向导'));
    console.log(chalk.gray('─'.repeat(40)));
    console.log('');

    // Auto-detect existing tool
    const detectedTool = detectTool(projectRoot);
    if (detectedTool) {
      console.log(chalk.gray(`  检测到当前项目使用: ${chalk.cyan(detectedTool)}`));
      console.log('');
    }

    // Step 1: Select AI coding tool
    const toolChoice = await select({
      message: '选择你的 AI 编程工具:',
      choices: TOOL_CHOICES,
      default: detectedTool || undefined,
    });

    // If multi-tool, let user pick multiple tools
    let selectedTools = [];
    if (toolChoice === 'multi') {
      const multiToolChoices = TOOL_CHOICES.filter(c => c.value !== 'multi');
      selectedTools = await checkbox({
        message: '选择要安装的工具 (空格选择，回车确认):',
        choices: multiToolChoices,
        required: true,
      });
    } else {
      selectedTools = [toolChoice];
    }

    // Step 2: Select plugins
    const selectedPlugins = await checkbox({
      message: '选择输出格式插件 (空格选择，回车确认):',
      choices: PLUGIN_CHOICES,
      required: true,
    });

    // Step 3: Select language
    const language = await select({
      message: '选择文档语言:',
      choices: LANGUAGE_CHOICES,
      default: 'zh-CN',
    });

    // Step 4: Design language config
    const useDesignLanguage = await confirm({
      message: '是否创建设计语言配置文件？(design-language.yaml)',
      default: true,
    });

    console.log('');
    console.log(chalk.blue('⚙️  正在生成配置...'));

    // Generate ai-viz.config.json
    const config = {
      version: '1.0.0',
      tool: toolChoice === 'multi' ? 'multi' : selectedTools[0],
      tools: toolChoice === 'multi' ? selectedTools : undefined,
      language: language === 'both' ? 'zh-CN' : language,
      plugins: selectedPlugins,
    };

    if (useDesignLanguage) {
      config.designLanguage = './design-language.yaml';
    }

    // Write config
    const configPath = path.join(projectRoot, 'ai-viz.config.json');
    await fs.writeJson(configPath, config, { spaces: 2 });
    console.log(chalk.green(`  ✓ ${path.relative(projectRoot, configPath)}`));

    // Copy design language template if selected
    if (useDesignLanguage) {
      const packageRoot = path.resolve(__dirname, '../..');
      const templateSrc = path.join(packageRoot, 'templates', 'design-language.yaml');
      const templateDest = path.join(projectRoot, 'design-language.yaml');
      if (await fs.pathExists(templateSrc)) {
        await fs.copy(templateSrc, templateDest, { overwrite: false });
        console.log(chalk.green(`  ✓ ${path.relative(projectRoot, templateDest)}`));
      }
    }

    // Compile
    console.log(chalk.blue('📦 正在编译指令文件...'));
    const compiler = new Compiler(projectRoot);
    const compiled = compiler.compile();

    // Install for each selected tool
    console.log(chalk.blue('📥 正在安装到 AI 工具...'));
    for (const toolId of selectedTools) {
      const AdapterClass = ADAPTERS[toolId]();
      const adapter = new AdapterClass();
      const files = await adapter.install(projectRoot, compiled);
      console.log(chalk.green(`  ✓ ${adapter.name} (${files.length} 个文件)`));
      for (const f of files) {
        console.log(chalk.gray(`    → ${path.relative(projectRoot, f)}`));
      }
    }

    // Success message
    console.log('');
    console.log(chalk.green.bold('✅ ai-viz 初始化完成！'));
    console.log('');
    console.log(chalk.gray('下一步:'));
    console.log(chalk.gray('  • 编辑 design-language.yaml 自定义配色方案'));
    console.log(chalk.gray('  • 向 AI 说 "画一个架构图" 开始使用'));
    console.log(chalk.gray('  • 运行 npx ai-viz add <plugin> 添加更多插件'));
    console.log(chalk.gray('  • 运行 npx ai-viz export <file.drawio> 导出图片'));
    console.log('');
  } catch (err) {
    if (err.name === 'ExitPromptError') {
      console.log(chalk.yellow('\n已取消初始化。'));
      return;
    }
    console.error(chalk.red(`\n✗ 初始化失败: ${err.message}`));
    process.exitCode = 1;
  }
};
