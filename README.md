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
