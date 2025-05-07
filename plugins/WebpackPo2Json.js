import path from 'path';
import { globSync } from 'glob';
import fs from 'fs';
import po2json from 'po2json';

export default class WebpackPo2Json {
  constructor(options) {
    this._hasRun = false;
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.done.tap('WebpackPo2Json', (stats) => {
      if (false === this._hasRun) {
        const { src, dest, handle, domain } = this.options;

        const files = globSync(src + '/*.po');
        if (files) {
          files.forEach(function (filepath) {
            const filename = path.parse(filepath).name;
            const destFilename =
              domain + '-' + filename + '-' + handle + '.json';
            const destPath = path.join(dest, destFilename);

            const file = po2json.parseFileSync(filepath, {
              format: 'jed1.x',
              stringify: true,
            });

            fs.writeFile(destPath, file, function (err) {
              if (err) {
                return console.log(err);
              }
            });
          });
        }
      }
      this._hasRun = true;
    });
  }
}
