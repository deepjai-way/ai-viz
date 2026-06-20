'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * Compiler - Reads config, loads source files, assembles output for target tool adapters.
 */
class Compiler {
  /**
   * @param {string} projectRoot - The user's project root where ai-viz.config.json lives
   */
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.packageRoot = path.resolve(__dirname, '../..');  // ai-viz package root
  }

  /**
   * Load project configuration (ai-viz.config.json)
   * @returns {Object} parsed config
   */
  loadConfig() {
    const configPath = path.join(this.projectRoot, 'ai-viz.config.json');
    if (!fs.existsSync(configPath)) {
      throw new Error(`Config file not found: ${configPath}`);
    }
    return fs.readJsonSync(configPath);
  }

  /**
   * Load core methodology files by language
   * @param {string} language - 'en' | 'zh-CN'
   * @returns {{ methodology: string, routing: string, quality: string }}
   */
  loadCore(language) {
    const coreDir = path.join(this.packageRoot, 'core');
    const suffix = language === 'zh-CN' ? '.zh-CN.md' : '.md';

    const loadFile = (name) => {
      const filePath = path.join(coreDir, `${name}${suffix}`);
      if (!fs.existsSync(filePath)) {
        // Fallback to English if localized version not found
        const fallback = path.join(coreDir, `${name}.md`);
        if (!fs.existsSync(fallback)) {
          throw new Error(`Core file not found: ${name}${suffix}`);
        }
        return fs.readFileSync(fallback, 'utf-8');
      }
      return fs.readFileSync(filePath, 'utf-8');
    };

    return {
      methodology: loadFile('methodology'),
      routing: loadFile('routing'),
      quality: loadFile('quality'),
    };
  }

  /**
   * Load specified plugin contents
   * @param {string[]} pluginNames - e.g. ['drawio', 'mermaid']
   * @param {string} language - 'en' | 'zh-CN'
   * @returns {Array<{ name: string, instructions: string, schema: string|null, pluginJson: Object }>}
   */
  loadPlugins(pluginNames, language) {
    const pluginsDir = path.join(this.packageRoot, 'plugins');
    const results = [];

    for (const pluginName of pluginNames) {
      const pluginDir = path.join(pluginsDir, pluginName);
      const pluginJsonPath = path.join(pluginDir, 'plugin.json');

      if (!fs.existsSync(pluginJsonPath)) {
        throw new Error(`Plugin not found: ${pluginName} (missing plugin.json at ${pluginJsonPath})`);
      }

      const pluginJson = fs.readJsonSync(pluginJsonPath);

      // Load instructions based on language
      let instructions = '';
      const instructionsKey = language === 'zh-CN' ? 'instructions_zh' : 'instructions';
      if (pluginJson.files && pluginJson.files[instructionsKey]) {
        const instructionsPath = path.join(pluginDir, pluginJson.files[instructionsKey]);
        if (fs.existsSync(instructionsPath)) {
          instructions = fs.readFileSync(instructionsPath, 'utf-8');
        }
      } else if (pluginJson.files && pluginJson.files.instructions) {
        // Fallback to default instructions
        const instructionsPath = path.join(pluginDir, pluginJson.files.instructions);
        if (fs.existsSync(instructionsPath)) {
          instructions = fs.readFileSync(instructionsPath, 'utf-8');
        }
      }

      // Load schema if exists
      let schema = null;
      if (pluginJson.files && pluginJson.files.schema) {
        const schemaPath = path.join(pluginDir, pluginJson.files.schema);
        if (fs.existsSync(schemaPath)) {
          schema = fs.readFileSync(schemaPath, 'utf-8');
        }
      }

      results.push({
        name: pluginName,
        instructions,
        schema,
        pluginJson,
      });
    }

    return results;
  }

  /**
   * Load rendering specs by category
   * @returns {Object} specs content keyed by category/filename
   */
  loadSpecs() {
    const specsDir = path.join(this.packageRoot, 'specs');
    const specs = {};

    if (!fs.existsSync(specsDir)) {
      return specs;
    }

    const categories = fs.readdirSync(specsDir).filter((item) => {
      return fs.statSync(path.join(specsDir, item)).isDirectory();
    });

    for (const category of categories) {
      specs[category] = {};
      const categoryDir = path.join(specsDir, category);
      const files = fs.readdirSync(categoryDir).filter((f) => f.endsWith('.md'));

      for (const file of files) {
        const name = path.basename(file, '.md');
        specs[category][name] = fs.readFileSync(path.join(categoryDir, file), 'utf-8');
      }
    }

    return specs;
  }

  /**
   * Load design language template
   * @returns {string|null} design language YAML content
   */
  loadDesignLanguage() {
    // First try project-level design-language.yaml
    const projectDesignLang = path.join(this.projectRoot, 'design-language.yaml');
    if (fs.existsSync(projectDesignLang)) {
      return fs.readFileSync(projectDesignLang, 'utf-8');
    }

    // Then try the config-specified path
    try {
      const config = this.loadConfig();
      if (config.designLanguage) {
        const configuredPath = path.resolve(this.projectRoot, config.designLanguage);
        if (fs.existsSync(configuredPath)) {
          return fs.readFileSync(configuredPath, 'utf-8');
        }
      }
    } catch (e) {
      // Config may not exist yet
    }

    // Fallback to package template
    const templatePath = path.join(this.packageRoot, 'templates', 'design-language.yaml');
    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, 'utf-8');
    }

    return null;
  }

  /**
   * Compile all content into a structured object for adapters to consume
   * @returns {{ core: Object, plugins: Array, specs: Object, designLanguage: string|null, config: Object }}
   */
  compile() {
    const config = this.loadConfig();
    const language = config.language || 'en';
    const pluginNames = config.plugins || [];

    const core = this.loadCore(language);
    const plugins = this.loadPlugins(pluginNames, language);
    const specs = this.loadSpecs();
    const designLanguage = this.loadDesignLanguage();

    return {
      core,
      plugins,
      specs,
      designLanguage,
      config,
    };
  }
}

module.exports = { Compiler };
