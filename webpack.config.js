const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env) => {
  const isProduction = env.production;
  const publicPath = isProduction ? '/' : '/';

  return {
    entry: "./src/index.tsx",
    mode: 'development',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/[name].[contenthash].bundle.js',
      publicPath,
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: {
                  localIdentName: '[path][name]__[local]--[hash:base64:5]',
                },
              },
            },
          ],
        },
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          use: {
            loader: 'babel-loader',
            options: {
              // babelrc: true,
              presets: [require.resolve("babel-preset-react-app")],
              // plugins: [
              //   [
              //     require.resolve("babel-plugin-named-asset-import"),
              //   ],
              // ],
            },
          }
        },
        // {
        //   test: /\.tsx?$/,
        //   use: {
        //     loader: 'ts-loader',
        //     options: {
        //       configFile: path.resolve(__dirname, './tsconfig.json')
        //     }
        //   }
        // },
        {
          test: /\.(less|.module\.less)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader', // translates CSS into CommonJS
            },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  // modifyVars: antModifyVars,
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          type: 'javascript/auto',
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10240,
                esModule:false,
                name: 'assets/[name].[ext]'
              }
            }
          ],
          exclude: /node_modules/
        },
      ],
    },
    resolve: {
      // fallback: {
      //   'react/jsx-runtime': 'react/jsx-runtime.js',
      //   'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
      // },
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    devServer: {
      static: {
        directory: path.join(__dirname, './public'),
      },
      client: {
        overlay: false,
      },
      host: '0.0.0.0',
      port: 3333,
      proxy: {},
      historyApiFallback: true,
      hot: true,
    },
    watchOptions: {
      aggregateTimeout: 500,
      poll: 1000,
      ignored: /node_modules/,
    },
    plugins: [
      new webpack.ProvidePlugin({
        React: 'react',
        ReactDOM: 'react-dom'
      }),      
      new CleanWebpackPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        title: '新建物料',
        template: `${path.join(__dirname, './public')}/index.ejs`,
        favicon: `${path.join(__dirname, './public')}/favicon.ico`,
        filename: 'index.html',
        inject: 'body',
        hash: true,
        cache: false,
        minify: {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          removeComments: true,
          collapseBooleanAttributes: true,
          collapseInlineTagWhitespace: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          minifyCSS: true,
          minifyJS: true,
          minifyURLs: true,
          useShortDoctype: true,
        },
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[id].[name].css',
        chunkFilename: '[id].css',
      })
    ],
    
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM'
    },
    devtool: 'source-map',
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    }
  };
};
