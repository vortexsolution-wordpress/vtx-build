import path from 'path';
import { fileURLToPath } from 'url';

import { glob } from 'glob';

import defaultConfig from '@wordpress/scripts/config/webpack.config.js';

import DependencyExtractionWebpackPlugin from '@wordpress/dependency-extraction-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';

import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';

import AssetsPlugin from 'assets-webpack-plugin';

import BuildOutputPlugin from '../plugins/BuildOutputPlugin.js';
import WebpackPo2Json from '../plugins/WebpackPo2Json.js';
import entries  from "./entries.js";
import RtlCssPlugin from "@wordpress/scripts/plugins/rtlcss-webpack-plugin/index.js";


const __themePath = path.resolve(process.cwd());
const isProduction = process.env.NODE_ENV === 'production';
const outputDir = path.join(__themePath, './dist');


let entry = entries;
let copy = [{
  from: 'assets/images',
  globOptions: {
    dot: false,
  },
  to: 'images', // Laravel mix will place this in 'public/img'
}];

/**
 * Webpack plugins
 */
let plugins = [];

plugins.push(
  new AssetsPlugin({
    filename: 'manifest.json',
    fullPath: false,
    removeFullPathAutoPrefix: true,
    path: outputDir,
  }),
  new RemoveEmptyScriptsPlugin(),
  new WebpackPo2Json({
    src: path.resolve(__themePath + '/lang' ),
    dest: path.resolve(__themePath + '/lang' ),
    handle: 'vtx-js',
    domain: 'vtx',
  }),
  new CopyPlugin({
    patterns: copy,
  }),
);


//image optimization
defaultConfig.optimization.minimizer.push(
  new ImageMinimizerPlugin({
    minimizer: {
      implementation: ImageMinimizerPlugin.imageminMinify,
      options: {
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }],
          [
            'svgo',
            {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    floatPrecision: 4,
                    overrides: {
                      convertPathData: {
                        applyTransforms: false,
                      },
                      removeViewBox: false,
                    },
                  },
                },
              ],
            },
          ],
        ],
      },
    },
    deleteOriginalAssets: false,
    generator: [
      {
        type: 'asset',
        implementation: ImageMinimizerPlugin.imageminGenerate,
        options: {
          plugins: [['imagemin-webp', { quality: 90 }]],
        },
      },
    ],
  })
);


//add our custom build output plugin
plugins.push(new BuildOutputPlugin({}));



/**
 * Plugins overrides
 */
defaultConfig.plugins.forEach((plugin, index) => {


  if (plugin instanceof MiniCSSExtractPlugin) {
    defaultConfig.plugins.splice(
      index,
      1,
      new MiniCSSExtractPlugin({
        filename: isProduction ? '[name].[fullhash:8].css' : '[name].css',
      })
    );
  }

  //replace the default dependency extraction config with our own
  if (plugin instanceof DependencyExtractionWebpackPlugin) {
    defaultConfig.plugins.splice(
      index,
      1,
      new DependencyExtractionWebpackPlugin({
        outputFormat: 'php',
        combineAssets: true,
        requestToExternal(request) {
          if (request === 'swiper') {
            return 'Swiper';
          }
        },
        requestToHandle(request) {
          if (request === 'Swiper') {
            return 'swiper';
          }
        },
      })
    );
  }

});

//remove RtlCssPlugin from the default config
defaultConfig.plugins.forEach((plugin, index) => {
  if (plugin instanceof RtlCssPlugin) {
    defaultConfig.plugins.splice(index, 1);
  }
});

defaultConfig.resolve.alias = {
  ...defaultConfig.resolve.alias,
  modernizr$: path.resolve(__themePath, '.modernizrrc'),
};

export default {
  ...defaultConfig,
  entry,
  output: {
    path: outputDir,
    filename: isProduction ? '[name].[fullhash:8].js' : '[name].js',
  },
  plugins: [...defaultConfig.plugins, ...plugins],
  stats: { ...defaultConfig.stats, preset: 'errors-warnings' },
  module: {
    ...defaultConfig.module,
    rules: [
      ...defaultConfig.module.rules.map(rule => {
        // Vérifier si la règle concerne les fichiers sass/scss
        if (rule.test && '/\\.(sc|sa)ss$/' === rule.test.toString()) {

          rule.use.map( loader => {
            // is sass-loader
            if (loader.loader && loader.loader.includes('sass-loader')) {
              loader.options = {
                ...loader.options,
                sassOptions : {
                  silenceDeprecations : [ 'import' ], //disable deprecation warning for @import
                }
              };
            }
          });

        }
        return rule;
      }),
      {
        test: /\.m?js/,
        type: 'javascript/auto',
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
    allowedHosts: 'auto',
    compress: true,
    historyApiFallback: true,
    hot: true,
    proxy: {
      '**': {
        target: 'http://themeinterne.vtx/',
        secure: true,
        changeOrigin: true,
        path: /./,
      },
    },
  },
};
