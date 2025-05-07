//import _ from 'lodash';
import chalk from 'chalk';
//import Table from 'cli-table3';

import * as readline from 'readline';
//import stripAnsi from 'strip-ansi';

import { formatSize } from 'webpack/lib/SizeFormatHelpers.js';
const name = process.env.npm_package_name;
const version = process.env.npm_package_version;

export default class BuildOutputPlugin {
  /**
   *
   * @param {BuildOutputOptions} options
   */
  constructor(options) {
    this.options = options;
    this.patched = false;
  }

  /**
   * Apply the plugin.
   *
   * @param {import("webpack").Compiler} compiler
   */
  apply(compiler) {
    // TODO: Refactor setup to allow removing this check
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    compiler.hooks.done.tap('BuildOutputPlugin', (stats) => {
      if (stats.hasErrors()) {
        return false;
      }

      const isWatch = process?.env?.npm_lifecycle_event === 'watch';

      if (isWatch) {
        this.clearConsole();
      }

      let data = stats.toJson({
        assets: true,
        builtAt: true,
        hash: true,
        performance: true,
        relatedAssets: this.options.showRelated,
      });

      this.heading(`🌀 ${name} ${version}`);

      if (data.assets.length) {
        console.log(
          chalk.green(
            `✔ Compiled Successfully in ${chalk.bold(`${data.time} ms`)}`
          )
        );

        const totalSize = chalk.bold(
          formatSize(data.assets.reduce((acc, asset) => acc + asset.size, 0))
        );

        console.log(
          chalk.blue(
            `💾 ${data.assets.length} assets for a total size of ${totalSize}`
          )
        );
      }
    });
  }

  /**
   * Print a block section heading.
   *
   * @param {string} text
   */
  heading(text) {
    console.log();
    console.log(chalk.bgBlue.white.bold(this.section(text)));
    console.log();
  }

  /**
   * Create a block section.
   *
   * @param {string} text
   */
  section(text) {
    const padLength = 3;
    const padding = ' '.repeat(padLength);

    text = `${padding}${text}${padding}`;

    const line = '─'.repeat(text.length);

    return `${line}\n${text}\n${line}`;
  }

  /**
   * Clear the entire screen.
   */
  clearConsole() {
    const blank = '\n'.repeat(process.stdout.rows);
    console.log(blank);

    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
  }
}
