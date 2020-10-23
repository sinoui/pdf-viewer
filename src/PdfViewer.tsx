import React, { useState, useRef } from 'react';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import uuid from 'uuid/v4';
import dayjs from 'dayjs';
import produce from 'immer';
import { Line } from 'rc-progress';
import PdfComment from './PdfComment';
import { PdfAnnotationType, AnnotationType } from './pdfTypes';
import './PdfViewer.css';
import ToolBar from './ToolBar';
import genSelectionRange from './utils/genSelectionRange';

interface Props {
  /**
   * 指定文件路径
   */
  url: string;
  /**
   * 编辑人
   */
  creator?: string;
  /**
   * 指定文件名称
   */
  title?: string;
}

/**
 * pdf阅读器
 */
export default function PdfViewer({ url, creator = '未知' }: Props) {
  const [pages, setPages] = useState(0);
  const [annotations, setAnnotations] = useState<PdfAnnotationType[]>([]);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [newAnnotations, setNewAnnotations] = useState<String[]>([]);
  // 加载进度
  const [progress, setProgress] = useState(0);
  const [annotationType] = useState<AnnotationType>('additional');

  const handleDocumentLoadSuccess = ({ numPages }: any) => {
    setPages(numPages);
  };

  /**
   * 基本的批注功能
   * @param offsetX
   * @param offsetY
   */
  const handleAddBaseAnnotion = (offsetX: number, offsetY: number) => {
    const id = uuid();
    const annotation = {
      id,
      x: offsetX,
      y: offsetY,
      type: annotationType,
      content: '',
      creator,
      createTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    };
    setAnnotations((prev) => [...prev, annotation]);
    setNewAnnotations((prev) => [...prev, annotation.id]);
  };

  /**
   * 文字批注
   * @param offsetX
   * @param offsetY
   */
  const handleTextAnnotation = (offsetX: number, offsetY: number) => {
    const flag = genSelectionRange(pdfContainerRef.current!);

    if (!flag) {
      return;
    }

    handleAddBaseAnnotion(offsetX, offsetY);
  };

  /**
   * 处理pdf的点击事件
   * @param event
   */
  const handlePageClick = (event: React.MouseEvent) => {
    const rect = pdfContainerRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    // 根据不同的批注类型选择不同的处理方式
    switch (annotationType) {
      case 'text':
        handleTextAnnotation(offsetX, offsetY);
        break;
      case 'additional':
        handleAddBaseAnnotion(offsetX, offsetY);
        break;
      default:
        break;
    }
  };

  const handleCommentChange = (annotation: PdfAnnotationType) => {
    setAnnotations(
      produce((draft: PdfAnnotationType[]) => {
        const index = draft.findIndex((item) => item.id === annotation.id);
        if (index !== -1) {
          draft[index] = annotation;
        }
      }),
    );
  };

  const handleCommentRemove = (annotation: PdfAnnotationType) => {
    setAnnotations(
      produce((draft: PdfAnnotationType[]) => {
        const index = draft.findIndex((item) => item.id === annotation.id);
        if (index !== -1) {
          draft.splice(index, 1);
        }
      }),
    );
  };

  const onLoadProgress = ({ total = 1, loaded = 0 }) => {
    setProgress(Math.floor(loaded / total) * 100);
  };

  return (
    <div className="sinoui-pdf-viewer-wrapper">
      <ToolBar>SJF </ToolBar>
      <div ref={pdfContainerRef} className="sinoui-pdf-viewer-content">
        <Document
          file={url}
          onLoadSuccess={handleDocumentLoadSuccess}
          loading={<Line percent={progress} strokeWidth={2} />}
          onLoadProgress={onLoadProgress}
          error={<div>加载文件失败</div>}
        >
          {Array.from(new Array(pages), (_el, index) => (
            <Page
              key={index}
              pageNumber={index + 1}
              onClick={(event: React.MouseEvent) => handlePageClick(event)}
            />
          ))}
          {annotations.map((annotation) => (
            <PdfComment
              key={annotation.id}
              annotation={annotation}
              defaultOpen={newAnnotations.includes(annotation.id)}
              defaultFocus={newAnnotations.includes(annotation.id)}
              onChange={handleCommentChange}
              onRemove={handleCommentRemove}
            />
          ))}
        </Document>
      </div>
    </div>
  );
}
