const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const BabiliWebpackPlugin = require('babili-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack');

const mode = process.env.NODE_ENV == 'production' ? 'production' : 'development';

module.exports = {
    mode: mode,
    entry: {
      'index': './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name][hash].js'
    },
    module: {
        rules: [
          {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                {
                    loader: 'css-loader',
                    options: {
                        url: true,
                        minimize: true,
                        sourceMap: false
                    }
                }
            ]
            })
          },
          {
            test: /\.html$/,
            use: 'vue-html-loader'
          },
          {
            test: /\.js$/,
            use: 'babel-loader',
            exclude: /node_modules/
          },
          {
            test: /\.vue$/,
            use: {
              loader: 'vue-loader',
              options: {
                loaders: {
                  sass: 'vue-style-loader!css-loader?indentedSyntax=1',
                  scss: 'vue-style-loader!css-loader'
                }
              }
            }
          },
          {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            use: {
              loader: 'url-loader',
              query: {
                limit: 2200,
                name: '[name].[ext]'
              }
            }
          },
          {
            test: /\.(ico)(\?.*)?$/,
            use: {
              loader: 'url-loader',
              query: {
                limit: 100,
                name: '[name].[ext]'
              }
            }
          },
          {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'media/[name]--[folder].[ext]'
            }
          },
          {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            use: {
              loader: 'url-loader',
              query: {
                limit: 10000,
                name: 'fonts/[name]--[folder].[ext]'
              }
            }
          }
        ]
    },

    devServer: {
        contentBase: path.join(__dirname, 'dist'), 
        hot: true, 
        host: '0.0.0.0',
        port: 3009
    },

    plugins: [
        new HtmlPlugin({
          chunks: ['index'],
          template: path.resolve(__dirname, 'src/index.html'),
          inject: true,
          filename: 'index.html',
        }),
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: true,
            output: {
              comments: false,
              beautify: true
            }
          }
        }),
         new ExtractTextPlugin('[name].[hash].css', {
            disable: false,
            allChunks: true
        })
    ],
    
}