import React from 'react';
import { storiesOf } from '@storybook/react';
import test from './test.pdf';
import PdfViewer from '../src/dynamic';
import './index.css';

storiesOf('pdf-viewer', module)
  .add('查看pdf', () => (
    <PdfViewer url={test} creator="张先生" title="测试文件.pdf" />
  ))
  .add('严格模式', () => (
    <PdfViewer url={test} strictMode creator="张先生" title="测试文件.pdf" />
  ));
