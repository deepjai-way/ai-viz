'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * BaseAdapter - Abstract base class for AI coding tool adapters.
 *
 * Each adapter translates compiled ai-viz content into the format
 * understood by a specific AI coding tool (e.g., Claude Code, Cursor, Windsurf).
 *
 * Subclasses MUST implement: getOutputDir, detect, install, uninstall.
 */
class BaseAdapter {
  /**
   * @param {string} name - Human-readable adapter name
   * @param {Object} config - Adapter configuration
   */
  constructor(name, config = {}) {
    if (new.target === BaseAdapter) {
      throw new Error('BaseAdapter is abstract and cannot be instantiated directly');
    }
    this.name = name;
    this.toolId = config.toolId || name.toLowerCase().replace(/\s+/g, '-');
    this.config = config;
  }

  /**
   * Get the output directory path for this adapter
   * @param {string} projectRoot - Project root path
   * @returns {string} Absolute path to the output directory
   */
  getOutputDir(projectRoot) {
    throw new Error('Method getOutputDir() must be implemented by subclass');
  }

  /**
   * Detect whether this AI coding tool is active in the current project.
   * Checks for the presence of tool-specific directories/files.
   * @param {string} projectRoot - Project root path
   * @returns {Promise<boolean>} True if the tool is detected
   */
  async detect(projectRoot) {
    throw new Error('Method detect() must be implemented by subclass');
  }

  /**
   * Install compiled content to the target location.
   * @param {string} projectRoot - Root path of the target project
   * @param {Object} compiled - Compiler output { core, plugins, specs, designLanguage, config }
   * @returns {Promise<string[]>} List of files created/updated
   */
  async install(projectRoot, compiled) {
    throw new Error('Method install() must be implemented by subclass');
  }

  /**
   * Uninstall/remove all ai-viz files for this tool.
   * @param {string} projectRoot - Root path of the target project
   * @returns {Promise<string[]>} List of files removed
   */
  async uninstall(projectRoot) {
    throw new Error('Method uninstall() must be implemented by subclass');
  }

  /**
   * Ensure output directory exists
   * @param {string} projectRoot
   * @returns {string} The output directory path
   */
  async ensureOutputDir(projectRoot) {
    const outputDir = this.getOutputDir(projectRoot);
    await fs.ensureDir(outputDir);
    return outputDir;
  }

  /**
   * Write a file to the output directory
   * @param {string} filePath - Absolute path to write
   * @param {string} content - File content
   * @returns {string} The written file path
   */
  async writeFile(filePath, content) {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf-8');
    return filePath;
  }

  /**
   * Build a plugin summary listing for core files
   * @param {Array} plugins - Array of plugin objects from compiler
   * @returns {string} Formatted plugin listing
   */
  buildPluginListing(plugins) {
    if (!plugins || plugins.length === 0) return '';

    const lines = ['## Available Plugins\n'];
    for (const plugin of plugins) {
      const pj = plugin.pluginJson;
      const displayName = pj.displayName || plugin.name;
      const desc = pj.description || '';
      const triggers = pj.triggers?.en?.join(', ') || '';
      lines.push(`### ${displayName}`);
      lines.push(`- **Name**: ${plugin.name}`);
      lines.push(`- **Description**: ${desc}`);
      if (triggers) {
        lines.push(`- **Triggers**: ${triggers}`);
      }
      lines.push('');
    }
    return lines.join('\n');
  }
}

module.exports = BaseAdapter;
