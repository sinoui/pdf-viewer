import React, { useEffect, useState } from 'react';
import joinPath from './joinPath';
import loadScript from './loadScript';
import type { Props } from '../PdfViewer';

/**
 * 动态加载 pdfjs 库的 PDF 阅读器
 */
const DynamicPdfViewer: React.FunctionComponent<
  Props & {
    loading?: React.ReactElement | null;
    publicPath?: string;
  }
> = ({ loading = null, publicPath = '/static', ...rest }) => {
  const [PdfViewer, setPdfViewer] = useState<{ default: any } | null>(null);
  useEffect(() => {
    const init = async () => {
      await loadScript(joinPath(publicPath, 'pdf.min.js'));
      await loadScript(joinPath(publicPath, 'pdf_viewer.js'));
      const { pdfjs } = await import('react-pdf');
      pdfjs.GlobalWorkerOptions.workerSrc = joinPath(
        publicPath,
        '/pdf.worker.min.js',
      );

      const result = await import('../PdfViewer');
      setPdfViewer(result);
    };

    init();
  }, [publicPath]);

  // eslint-disable-next-line react/jsx-pascal-case
  return PdfViewer?.default ? <PdfViewer.default {...rest} /> : loading;
};

export default DynamicPdfViewer;
