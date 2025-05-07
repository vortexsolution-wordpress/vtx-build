#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path vers le webpack.config.js du package vtx-build
const customWebpackConfigPath = path.resolve(__dirname, '../config/webpack.config.js');

// Arguments passés au script, ex: ["build"]
const cliArgs = process.argv.slice(2);

// On sépare la commande principale (build, start, etc.) des autres arguments
const command = cliArgs[0] || 'build';
const restArgs = cliArgs.slice(1);

// On construit le tableau d'arguments en plaçant --config après la commande
const finalArgs = ['@wordpress/scripts', command];

// Si --config n'est PAS déjà présent, on l'ajoute
if (!restArgs.includes('--config')) {
  finalArgs.push('--config', customWebpackConfigPath);
} else {
  // On récupère l'index et on ajoute les arguments tels quels
  const configIndex = restArgs.indexOf('--config');
  finalArgs.push(...restArgs);
}

spawn('npx', finalArgs, {
  stdio: 'inherit',
  shell: true,
});
