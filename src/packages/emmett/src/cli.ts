#!/usr/bin/env node
import { Command } from 'commander';
import 'ts-node/esm'; // Allows dynamic TypeScript imports
import { loadPlugins, registerCliPlugins } from './commandLine';

const program = new Command();

program
  .name('emmett')
  .description('CLI tool for Emmett')
  .option(
    '--config <path>',
    'Path to the configuration file',
    `emmett.config.ts`,
  );

// Load extensions and parse CLI arguments
const initCLI = async () => {
  const options = program.opts<{ config: string }>();
  const configPath = options.config;

  try {
    const plugins = await loadPlugins({
      pluginType: 'cli',
      configPath: configPath,
    });
    await registerCliPlugins(program, plugins);

    // Parse the CLI arguments
    program.parse(process.argv);
  } catch (err) {
    console.error(`Failed to load config from ${configPath}:`, err);
  }
};

// Initialize CLI and handle errors
initCLI().catch((err) => {
  console.error(`CLI initialization failed:`);
  console.error(err);
});

export default program;
export * from './commandLine';
