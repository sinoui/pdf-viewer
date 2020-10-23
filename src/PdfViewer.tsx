import React, { useState, useRef } from 'react';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import dayjs from 'dayjs';
import produce from 'immer';
import PdfComment from './PdfComment';
import { PdfAnnotationType } from './pdfTypes';

interface Props {
  url: string;
  creator?: string;
}

const PdfViewerWrapper = styled.div`
  background-color: #565656;
  overflow: auto;
  max-height: 100vh;

  > div {
    width: 594px;
    margin: 8px auto;
    box-sizing: border-box;
    position: relative;
  }

  .react-pdf__Page {
    padding: 8px 0;
  }
`;

/**
 * pdf阅读器
 */
export default function PdfViewer({ url, creator = '未知' }: Props) {
  const [numPages, setNumPages] = useState(0);
  const [annotations, setAnnotations] = useState<PdfAnnotationType[]>([]);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [newAnnotations, setNewAnnotations] = useState<String[]>([]);

  const handleDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
  };

  const handlePageClick = (event: React.MouseEvent) => {
    const rect = pdfContainerRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const annotation = {
      id: uuid(),
      x: offsetX,
      y: offsetY,
      content: '',
      creator,
      createTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    };
    setAnnotations((prev) => [...prev, annotation]);
    setNewAnnotations((prev) => [...prev, annotation.id]);
  };

  const handleCommentChange = (annotation: PdfAnnotationType) => {
    setAnnotations(
      produce((draft) => {
        const index = draft.findIndex((item) => item.id === annotation.id);
        if (index !== -1) {
          draft[index] = annotation;
        }
      }),
    );
  };

  const handleCommentRemove = (annotation: PdfAnnotationType) => {
    setAnnotations(
      produce((draft) => {
        const index = draft.findIndex((item) => item.id === annotation.id);
        if (index !== -1) {
          draft.splice(index, 1);
        }
      }),
    );
  };

  return (
    <PdfViewerWrapper>
      <div ref={pdfContainerRef}>
        <Document
          file={url}
          onLoadSuccess={handleDocumentLoadSuccess}
          loading={<div>正在加载pdf文件...</div>}
          error={<div>加载文件失败</div>}
        >
          {Array.from(new Array(numPages), (_el, index) => (
            <Page
              key={index}
              pageNumber={index + 1}
              onClick={(event) => handlePageClick(event)}
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
    </PdfViewerWrapper>
  );
}
