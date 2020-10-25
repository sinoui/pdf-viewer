const { resolve } = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    exclude: resolve(__dirname, 'node_modules'),
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          presets: ['babel-preset-ts-lib'],
          cacheDirectory: true,
        },
      },
    ],
  });
  config.resolve.extensions.push('.ts', '.tsx');
  config.resolve.alias = {
    '@sinoui/pdf-viewer': resolve(__dirname, '../src'),
  };

  config.plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: resolve(
            __dirname,
            '../node_modules/pdfjs-dist/build/pdf.min.js',
          ),
          to: 'static',
        },
        {
          from: resolve(
            __dirname,
            '../node_modules/pdfjs-dist/build/pdf.worker.min.js',
          ),
          to: 'static',
        },
        {
          from: resolve(
            __dirname,
            '../node_modules/pdfjs-dist/web/pdf_viewer.js',
          ),
          to: 'static',
        },
      ],
    }),
  );

  config.externals = {
    'pdfjs-dist': 'pdfjsLib',
    'pdfjs-dist/lib/web/pdf_link_service': 'pdfjsViewer',
  };

  return config;
};
