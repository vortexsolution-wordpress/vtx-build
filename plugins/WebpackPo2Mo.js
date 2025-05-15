import path from 'path';
import { globSync } from 'glob';
import gettextParser from 'gettext-parser';
import promises from "fs/promises";

export default class WebpackPo2Mo {
  constructor(options) {
    this._hasRun = false;
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.done.tap('WebpackPo2Mo', (stats) => {
      if (false === this._hasRun) {

        const { src } = this.options;
        const dest = src;

        const files = globSync(src + '/*.po');
        if (files) {
          files.forEach(function (filepath) {
            const filename = path.parse(filepath).name;
            const destFilename =  filename + '.mo';
            const destPath = path.join(dest, destFilename);

            const poFile = promises.readFile(filepath, 'utf-8').then(
              (data) => {
                const poData = gettextParser.po.parse(data);
                const moData = gettextParser.mo.compile(poData);
                return  promises.writeFile(destPath, moData);
              }
            );
          });
        }
      }
      this._hasRun = true;
    });
  }



}
