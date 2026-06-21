'use strict';

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

/**
 * Export a diagram to PNG/SVG.
 *
 * Supported formats:
 * - .drawio / .xml  → uses Draw.io Desktop CLI
 * - .excalidraw     → uses built-in converter + @resvg/resvg-js
 *
 * @param {string} file - Path to the diagram file
 * @param {object} options - Command options
 * @param {string} [options.format] - Output format (png, svg)
 * @param {string} [options.scale] - Export scale factor
 */
module.exports = async function exportCmd(file, options) {
  try {
    const resolvedFile = path.resolve(file);

    // 1. Check if file exists
    if (!await fs.pathExists(resolvedFile)) {
      console.error(chalk.red(`✗ 文件不存在: ${resolvedFile}`));
      process.exitCode = 1;
      return;
    }

    // 2. Determine file type
    const ext = path.extname(resolvedFile).toLowerCase();
    const format = options.format || 'png';
    const scale = parseInt(options.scale, 10) || 2;

    if (ext === '.excalidraw') {
      await exportExcalidraw(resolvedFile, format, scale);
    } else if (ext === '.drawio' || ext === '.xml') {
      await exportDrawio(resolvedFile, format, scale);
    } else {
      console.error(chalk.red(`✗ 不支持的文件格式: ${ext}`));
      console.log(chalk.gray('  支持的格式: .drawio, .xml, .excalidraw'));
      process.exitCode = 1;
    }
  } catch (err) {
    console.error(chalk.red(`\n✗ 导出失败: ${err.message}`));
    process.exitCode = 1;
  }
};

/**
 * Export an Excalidraw file.
 */
async function exportExcalidraw(resolvedFile, format, scale) {
  const packageRoot = path.resolve(__dirname, '../..');
  const exportDriver = require(path.join(packageRoot, 'plugins', 'excalidraw', 'export.js'));

  const info = exportDriver.getInfo();
  if (format === 'png' && !info.hasResvg) {
    console.error(chalk.red('✗ PNG 导出需要 @resvg/resvg-js'));
    console.log(chalk.gray('  运行: npm install @resvg/resvg-js'));
    console.log(chalk.gray('  或使用 --format svg 导出 SVG 格式'));
    process.exitCode = 1;
    return;
  }

  const outputFile = resolvedFile.replace(/\.excalidraw$/i, `.${format}`);
  console.log(chalk.blue(`📊 正在导出: ${path.basename(resolvedFile)}`));

  const result = exportDriver.exportDiagram(resolvedFile, outputFile, { format, scale });

  if (result.success) {
    const relOutput = path.relative(process.cwd(), result.outputFile);
    console.log(chalk.green(`✓ 导出成功: ${relOutput}`));
    console.log(chalk.gray(`  格式: ${format.toUpperCase()}, 缩放: ${scale}x`));
  } else {
    console.error(chalk.red(`✗ 导出失败: ${result.error}`));
    process.exitCode = 1;
  }
}

/**
 * Export a DrawIO file.
 */
async function exportDrawio(resolvedFile, format, scale) {
  const packageRoot = path.resolve(__dirname, '../..');
  const exportDriver = require(path.join(packageRoot, 'plugins', 'drawio', 'export.js'));

  const info = exportDriver.getInfo();
  if (!info.installed) {
    console.error(chalk.red('✗ 未检测到 Draw.io Desktop 安装'));
    console.log(chalk.gray('  请从 https://github.com/jgraph/drawio-desktop/releases 下载安装'));
    console.log(chalk.gray('  或设置环境变量 DRAWIO_PATH 指向可执行文件'));
    process.exitCode = 1;
    return;
  }

  console.log(chalk.blue(`📊 正在导出: ${path.basename(resolvedFile)}`));
  console.log(chalk.gray(`  Draw.io 路径: ${info.path}`));

  const outputFile = resolvedFile.replace(/\.(drawio|xml)$/i, `.${format}`);

  const result = exportDriver.exportDiagram(resolvedFile, outputFile, { format, scale });

  if (result.success) {
    const relOutput = path.relative(process.cwd(), result.outputFile);
    console.log(chalk.green(`✓ 导出成功: ${relOutput}`));
    console.log(chalk.gray(`  格式: ${format.toUpperCase()}, 缩放: ${scale}x`));
  } else {
    console.error(chalk.red(`✗ 导出失败: ${result.error}`));
    process.exitCode = 1;
  }
}
