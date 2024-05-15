const path = require('path');
const nodeVersion = '20.12';
module.exports = {
  entry: { auth: './backend/auth/handler', dog: './backend/dog/handler' },
  devtool: 'source-map',
  output: {
    path: path.resolve(process.cwd(), 'dist/be'),
    filename: '[name].js',
    library: { type: 'commonjs2' },
  },
  target: `node${nodeVersion}`,
  module: {
    rules: [
      {
        test: /.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { node: nodeVersion } }],
            ],
          },
        },
      },
    ],
  },
};
