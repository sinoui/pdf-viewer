import React from 'react';
import { storiesOf } from '@storybook/react';
import test from './test.pdf';
import PdfViewer from '../src';
import './index.css';

storiesOf('pdf-viewer', module).add('查看pdf', () => (
  <PdfViewer url={test} creator="办公厅/张三" />
));
