const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const { phaser, phaserModule, nodeModules, dist, dev } = require('./paths');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
  

const definePlugin = new webpack.DefinePlugin({
  WEBGL_RENDERER: true,
  CANVAS_RENDERER: true,
  'typeof SHADER_REQUIRE': JSON.stringify(false),
  'typeof CANVAS_RENDERER': JSON.stringify(true),
  'typeof WEBGL_RENDERER': JSON.stringify(true),
  'process.env.NODE_ENV': JSON.stringify('development')
});

const htmlPlugin = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: './index.html',
  excludeChunks: ['createApp']
});

const createHtmlPlugin = new HtmlWebpackPlugin({
  filename: 'create/index.html',
  template: 'src/create/index.html',
  excludeChunks: ['app']
});

const copyWebpackPlugin = new CopyWebpackPlugin([
  { from: './src/assets/images/clippy.svg', to: 'assets/images/clippy.svg' }
]);

const browserSyncPlugin = new BrowserSyncPlugin(
  {
    host: process.env.IP || 'localhost',
    port: process.env.PORT || 3000,
    proxy: 'http://localhost:8080/'
  },
  { reload: false }
);

const analyzerPlugin = new BundleAnalyzerPlugin();

module.exports = (env, options) => {
  return {
    devServer: {
      host: '0.0.0.0',
      headers: { 
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true"
      }
    },
    mode: 'development',
    devtool: 'cheap-eval-source-map',
    entry: {
      app: './src/index.js',
      createApp: './src/create/create.js'
    },
    output: {
      path: dist,
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js',
      publicPath: '/'
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },
    plugins: [definePlugin, htmlPlugin, createHtmlPlugin, analyzerPlugin, browserSyncPlugin, copyWebpackPlugin],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [nodeModules],
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.(png|jpg|gif|ico|svg|pvr|pkm|static|mp3|webm)$/,
          exclude: [nodeModules],
          use: ['file-loader']
        },
        {
          test: [/\.vert$/, /\.frag$/],
          exclude: [nodeModules],
          use: 'raw-loader'
        },
        {
          test: [/\.vert$/, /\.frag$/],
          exclude: [nodeModules],
          use: 'raw-loader'
        },
        {
          test: /\.css$/i,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localsConvention: 'dashes',
                sourceMap: true
              }
            }
          ]
        }
      ]
    },
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    }
  };
};
