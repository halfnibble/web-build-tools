import * as Webpack from 'webpack';
import * as TerserPlugin from 'terser-webpack-plugin';
import { WebpackTask } from './WebpackTask';
import * as path from 'path';

// Note: this require may need to be fixed to point to the build that exports the gulp-core-build-webpack instance.
const webpackTask: WebpackTask = require('@microsoft/web-library-build').webpack;

const isProduction: boolean = webpackTask.buildConfig.production;

const packageJSON: { name: string } = require('./package.json');

const webpackConfiguration: Webpack.Configuration = {
  context: __dirname,
  devtool: (isProduction) ? undefined : 'source-map',
  mode: (isProduction) ? 'production' : 'development',

  entry: {
    [packageJSON.name]: path.join(__dirname, webpackTask.buildConfig.libFolder, 'index.js')
  },

  output: {
    libraryTarget: 'umd',
    path: path.join(__dirname, webpackTask.buildConfig.distFolder),
    filename: `[name]${isProduction ? '.min' : ''}.js`
  },

  devServer: {
    stats: 'none'
  },

  // The typings are missing the "object" option here (https://webpack.js.org/configuration/externals/#object)
  externals: {
    'react': {
      amd: 'react',
      commonjs: 'react'
    },
    'react-dom': {
      amd: 'react-dom',
      commonjs: 'react-dom'
    }
  } as any, // tslint:disable-line:no-any

  plugins: [
    // new WebpackNotifierPlugin()
  ]
};

if (isProduction && webpackConfiguration.plugins) {
  webpackConfiguration.optimization = {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            dead_code: false,
            warnings: false
          },
          mangle: true
        }
      })
    ]
  };
}

exports = webpackConfiguration;
