import fs from 'fs';
import path from 'path';

export default class RemoveEmptyJsFilesPlugin {
  /**
   * Constructor for RemoveEmptyJsFilesPlugin
   * @param {Object} options - Plugin options
   */
  constructor(options = {}) {
    this.options = options;
  }

  /**
   * Apply the plugin to webpack compiler
   * @param {import("webpack").Compiler} compiler
   */
  apply(compiler) {
    // Hook into the 'done' event which fires after the build is complete
    compiler.hooks.done.tap('RemoveEmptyJsFilesPlugin', (stats) => {
      // Skip if there are compilation errors
      if (stats.hasErrors()) {
        return;
      }

      const outputPath = compiler.options.output.path;

      // Get all assets from the compilation
      const assets = stats.compilation.assets;

      // Filter for JS files and check if they are empty (0 bytes)
      Object.keys(assets).forEach(assetName => {
        if (assetName.endsWith('.js')) {
          const filePath = path.join(outputPath, assetName);

          try {
            // Check if file exists and get its size
            if (fs.existsSync(filePath)) {
              const stats = fs.statSync(filePath);

              // If file size is 0 bytes, remove it
              if (stats.size === 0) {
                fs.unlinkSync(filePath);
                //console.log(`🗑️  Removed empty JS file: ${assetName}`);
              }
            }
          } catch (error) {
            console.warn(`Warning: Could not process file ${assetName}:`, error.message);
          }
        }
      });
    });
  }
}
