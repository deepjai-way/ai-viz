'use strict';

const { Command } = require('commander');
const pkg = require('../package.json');

const program = new Command();

program
  .name('ai-viz')
  .description(pkg.description)
  .version(pkg.version);

program
  .command('init')
  .description('Initialize ai-viz configuration in the current project')
  .action(async (options) => {
    const initCmd = require('./commands/init');
    await initCmd(options);
  });

program
  .command('add <plugin>')
  .description('Add a plugin to the current project')
  .action(async (plugin, options) => {
    const addCmd = require('./commands/add');
    await addCmd(plugin, options);
  });

program
  .command('remove <plugin>')
  .description('Remove a plugin from the current project')
  .action(async (plugin, options) => {
    const removeCmd = require('./commands/remove');
    await removeCmd(plugin, options);
  });

program
  .command('export <file>')
  .description('Export a DrawIO diagram to PNG/SVG/PDF')
  .option('-f, --format <format>', 'Output format (png, svg, pdf)', 'png')
  .option('--scale <scale>', 'Export scale factor', '2')
  .action(async (file, options) => {
    const exportCmd = require('./commands/export');
    await exportCmd(file, options);
  });

program
  .command('update')
  .description('Re-compile and re-install instruction files')
  .action(async (options) => {
    const updateCmd = require('./commands/update');
    await updateCmd(options);
  });

program.parse(process.argv);
