# @sinoui/pdf-viewer

基于[react-pdf](https://projects.wojtekmaj.pl/react-pdf/)的 pdf 预览。

## 基本使用

```tsx
import PdfViewer from '@sinoui/pdf-viewer';
import testFilePath from './test.pdf';

<PdfViewer url={testFilePath} title="xxx.pdf" />;
```

## PdfViewer 属性列表

| 属性名称         | 属性类型                                                                                | 属性说明       |
| ---------------- | --------------------------------------------------------------------------------------- | -------------- |
| url              | string                                                                                  | 指定文件路径   |
| creator          | string                                                                                  | 文件编辑人     |
| title            | string                                                                                  | 文件标题       |
| annotationsStore | ` {get: () => Promise<any>; save: (annotations: PdfAnnotationType[]) =>Promise<any> };` | 自定义存储方式 |

## 批注存储

批注信息默认存储在`localStorage`中,如果需要与后端交互，则需要通过`annotationsStore`属性指定存储方式，具体如下：

```tsx
const annotationsStore = {
  async get() {
    return await http.get(`/apis/pdf-annotations/${fileId}`);
  },
  async save(annotations) {
    return await http.post(`/apis/pdf-annotations/${fileId}`, annotations);
  },
};

<PdfViewer
  url={testFilePath}
  creator="张三"
  annotationsStore={annotationsStore}
/>;
```

## 优化

### 在 webpack 中使用

在 webpack 中使用 pdf-viewer，往往会导致开发与编译缓慢。这是因为 pdf.js 代码量特别大，推荐的做法是采用 [webpack exnternals](https://webpack.docschina.org/configuration/externals/)，直接加载 pdf.js 的包，而不经过 webpack 打包处理。具体做法如下所示。

#### 直接拷贝 pdfjs 文件

可以通过 [copy-webpack-plugin](https://webpack.docschina.org/plugins/copy-webpack-plugin/)，将 `node_modules/pdfjs-dist` 中的 js 文件拷贝到包中。

安装 copy-webpack-plugin:

```tsx
yarn add copy-webpack-plugin --dev
```

在 webpack 的配置文件中添加以下配置：

```tsx
const CopyPlugin = require('copy-webpack-plugin');

const config = {
  plugins: [
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
  ],
};
```

### 配置外部扩展

将 pdfjs-dist 配置为 外部扩展：

```ts
const config = {
  externals: {
    'pdfjs-dist': 'pdfjsLib',
    'pdfjs-dist/lib/web/pdf_link_service': 'pdfjsViewer',
  },
};
```

### 使用 `@sinoui/pdf-viewer/dynamic` 组件

`@sinoui/pdf-viewer/dynamic` 提供了便捷的动态加载 pdf.js 脚本的组件，用法与`PdfViewer` 一致，与如下所示：

```tsx
import PdfViewerDynamic from '@sinoui/pdf-viewer/dynamic';

function PdfViewerDemo() {
  return (
    <PdfViewerDynamic
      publicPath="/static"
      url="/test.pdf"
      loading={<div>正在准备pdf阅读器</div>}
    />
  );
}
```

`publicPath` 可以与 webpack 中的 `process.env.PUBLIC_PATH` 组合使用：

```tsx
import PdfViewerDynamic from '@sinoui/pdf-viewer/dynamic';

function PdfViewerDemo() {
  return (
    <PdfViewerDynamic
      publicPath={process.env.PUBLIC_PATH}
      url="/test.pdf"
      loading={<div>正在准备pdf阅读器</div>}
    />
  );
}
```

### 与 storybook 组合使用

需要在 `.storybook/webpack.config.js` 中添加类似上文提出的配置。如下所示：

```tsx
const { resolve } = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = ({ config }) => {
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
```

## 本地开发

项目中有以下有用的命令。

### `yarn build`

打包，并将打包文件放在`dist`文件夹中。使用 rollup 对代码做优化并打包成多种格式（`Common JS`，`UMD`和`ES Module`）。

### `yarn lint`

`yarn lint`会检查整个项目是否有代码错误、风格错误。

开启 vscode 的 eslint、prettier 插件，在使用 vscode 编码时，就会自动修正风格错误、提示语法错误。

### `yarn format`

`yarn format`可以自动调整整个项目的代码风格问题。

### `yarn test`

`yarn test`以监听模式启动 jest，运行单元测试。

开启 vscode 的 jest 插件，会在文件变化时自动运行单元测试。

### `yarn release`

发布 npm 包的命令。
