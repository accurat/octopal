import * as webpack from 'webpack'
import * as path from 'path'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'

export const paths = {
  SRC: path.resolve(__dirname, 'src'),
  BUILD: path.resolve(__dirname, 'build'),
  ASSETS: path.resolve(__dirname, 'src/styles'),
}

const config: webpack.Configuration = {
  output: {
    library: 'accuratGithubChromeExtension',
    path: paths.BUILD,
    publicPath: '',
    filename: '[name]/[name].bundle.js',
    chunkFilename: '[name]/[name]-[id].chunk.js',
  },

  entry: {
    plugin: path.resolve(paths.SRC, 'plugin/plugin.ts'),
    popup: path.resolve(paths.SRC, 'popup/index.ts'),
    background: path.resolve(paths.SRC, 'background/background.ts'),
  },

  devtool: 'source-map',

  stats: {
    children: false,
  },

  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new HtmlWebpackPlugin({
      filename: 'popup/[name].html',
      template: path.resolve(paths.SRC, 'popup/index.html'),
    }),
    new MiniCssExtractPlugin(),
  ],

  externals: {
    window: 'window',
    require: 'require',
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  module: {
    rules: [
      {
        type: 'javascript/auto',
        test: /\.(html|jpg|png|json)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: paths.SRC,
            },
          },
        ],
      },
      {
        test: require.resolve('arrive'),
        use: 'imports-loader?this=>window',
      },
      {
        use: 'ts-loader',
        test: /\.(ts|js)$/,
        exclude: [/node_modules/, paths.ASSETS],
        include: paths.SRC,
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
}

export default config
