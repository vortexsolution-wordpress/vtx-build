#!/usr/bin/env node
import { getNodeArgsFromCLI, spawnScript } from '@wordpress/scripts/utils/index.js';
import { fileURLToPath } from 'url';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin vers le répertoire node_modules de vtx-build
const modulePath = path.resolve(__dirname, '../node_modules');

// Définir NODE_PATH pour aider à résoudre les modules
process.env.NODE_PATH = process.env.NODE_PATH
  ? `${process.env.NODE_PATH}${path.delimiter}${modulePath}`
  : modulePath;


require('module').Module._initPaths();

const customWebpackConfigPath = path.resolve(__dirname, '../config/webpack.config.js');
const customWebpackConfig = path.relative(process.cwd(), customWebpackConfigPath);

const { scriptName, scriptArgs, nodeArgs } = getNodeArgsFromCLI();

scriptArgs.push('--config', customWebpackConfig);

spawnScript(scriptName, scriptArgs, nodeArgs);
