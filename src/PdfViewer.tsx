/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import uuid from 'uuid/v4';
import dayjs from 'dayjs';
import produce from 'immer';
import { Line } from 'rc-progress';
import Scrollbars from 'react-custom-scrollbars';
import classNames from 'classnames';
import PdfComment from './PdfComment';
import PdfTextComment from './PdfTextComment';
import { PdfAnnotationType, AnnotationType } from './pdfTypes';
import './PdfViewer.css';
import ToolBar from './ToolBar';
import { getRectsBySelection, genNodeByRects } from './utils/genSelectionRange';
import ToolbarActions from './ToolbarActions';
import MessageIcon from './icons/MessageIcon';
import TextIcon from './icons/TextIcon';
import PageNumber from './PageNumber';
import DownloadButton from './DownLoadButton';

export interface Props {
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
  /**
   * 自定义存储
   */
  annotationsStore?: {
    get: () => Promise<any>;
    save: (annotations: PdfAnnotationType[]) => Promise<any>;
  };
  /**
   * 严格模式
   * 严格模式下禁止选中和下载
   */
  strictMode?: boolean;
  /**
   * pdf.js 的配置项。详见：[PDF.js documentation on DocumentInitParameters](https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib.html#~DocumentInitParameters)。
   */
  options?: any;
}

/**
 * pdf阅读器
 */
export default function PdfViewer({
  url,
  creator = '未知',
  title,
  annotationsStore,
  strictMode,
  options,
}: Props) {
  const [pages, setPages] = useState(0);
  const [annotations, setAnnotations] = useState<PdfAnnotationType[]>([]);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [newAnnotations, setNewAnnotations] = useState<String[]>([]);
  const [loading, setLoading] = useState(true);
  // 加载进度
  const [progress, setProgress] = useState(0);
  const [annotationType, setAnnotationType] = useState<AnnotationType>(
    'normal',
  );

  const scrollbarRef = useRef<Scrollbars | null>(null);

  const [current, setCurrent] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);

  const initHeighLightDom = (nodes: PdfAnnotationType[]) => {
    const texts = nodes.filter((node) => node.type === 'text');
    texts.forEach((ano) => {
      genNodeByRects(
        ano.rects ?? [],
        pdfContainerRef.current!,
        ano.id,
        ano.containerRect,
      );
    });
  };

  const handleDocumentLoadSuccess = async ({ numPages }: any) => {
    setPages(numPages);
    setLoading(false);

    if (annotationsStore) {
      const defaultAnnotations = await annotationsStore.get();
      setAnnotations(defaultAnnotations);
      setNewAnnotations(
        defaultAnnotations.map((item: PdfAnnotationType) => item.id),
      );
      // 修复文字批注回显位置不正确的问题
      requestAnimationFrame(() => {
        initHeighLightDom(defaultAnnotations);
      });
    } else {
      const defaultData = localStorage.getItem('pdf-annotations');
      const defaultAnnotations = defaultData ? JSON.parse(defaultData) : [];
      setAnnotations(defaultAnnotations);
      requestAnimationFrame(() => {
        initHeighLightDom(defaultAnnotations);
      });
    }
  };

  const saveAnnotations = (notes: PdfAnnotationType[]) => {
    if (annotationsStore) {
      annotationsStore.save(notes);
    }

    localStorage.setItem('pdf-annotations', JSON.stringify(notes));
  };

  /**
   * 基本的批注功能
   * @param offsetX
   * @param offsetY
   */
  const handleAddBaseAnnotion = (
    offsetX: number,
    offsetY: number,
    id = uuid(),
    rects?: DOMRect[],
    containerRect?: DOMRect,
  ) => {
    const annotation = {
      id,
      x: offsetX,
      y: offsetY,
      type: annotationType,
      content: '',
      creator,
      createTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      rects,
      containerRect,
    };
    setAnnotations((prev) => [...prev, annotation]);
    setNewAnnotations((prev) => [...prev, id]);
    //  批注添加完成之后返回普通操作的模式
    setAnnotationType('normal');
    setCurrent(id);
  };

  /**
   * 文字批注
   * @param offsetX
   * @param offsetY
   */
  const handleTextAnnotation = (offsetX: number, offsetY: number) => {
    const id = uuid();
    const selection = window.getSelection();
    const rects = getRectsBySelection(selection!);
    if (rects.length === 0) {
      return;
    }
    genNodeByRects(rects, pdfContainerRef.current!, id);

    handleAddBaseAnnotion(
      offsetX,
      offsetY,
      id,
      rects,
      pdfContainerRef.current?.getBoundingClientRect(),
    );
  };

  /**
   * 处理pdf的点击事件
   * @param event
   */
  const handlePageClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrent(undefined);
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
    const idx = annotations.findIndex((item) => item.id === annotation.id);
    if (idx !== -1) {
      const newItems = [
        ...annotations.slice(0, idx),
        annotation,
        ...annotations.slice(idx + 1),
      ];
      saveAnnotations(newItems);
    }

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
    const idx = annotations.findIndex((item) => item.id === annotation.id);
    if (idx !== -1) {
      const newItems = [
        ...annotations.slice(0, idx),
        ...annotations.slice(idx + 1),
      ];
      saveAnnotations(newItems);
    }

    setAnnotations(
      produce((draft: PdfAnnotationType[]) => {
        const index = draft.findIndex((item) => item.id === annotation.id);
        if (index !== -1) {
          draft.splice(index, 1);
        }
      }),
    );
  };

  const onLoadProgress = useCallback(({ total = 1, loaded = 0 }) => {
    setProgress(Math.floor(loaded / total) * 100);
  }, []);

  const onAddAdditionalNoteClick = useCallback((type: AnnotationType) => {
    setAnnotationType(type);
  }, []);

  const fileTitle = useMemo(() => {
    if (title) {
      return title;
    }
    const arr = url.split('/');
    return arr[arr.length - 1];
  }, [title, url]);

  const handleClick = (event: any) => {
    const { target } = event;
    const {
      dataset: { id },
    } = target;

    if (!id) {
      return;
    }
    setCurrent(id);
    setNewAnnotations([id]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const code = event.key;
    if (code === 'Delete' && current) {
      const anno = annotations.find((item) => item.id === current);
      handleCommentRemove(anno!);
      const nodes = document.querySelectorAll('.pdf-text-annotation');
      Array.from(nodes).forEach((node: any) => {
        const { id } = node.dataset;
        if (id === current) {
          pdfContainerRef.current?.removeChild(node);
        }
      });
    }
  };

  const textAnnotation = useMemo(
    () => annotations.filter((item) => item.type === 'text'),
    [annotations],
  );

  const commonAnnotation = useMemo(
    () => annotations.filter((item) => item.type !== 'text'),
    [annotations],
  );

  const onScroll = () => {
    const top = scrollbarRef.current?.getScrollTop() ?? 0;
    const pageNo = Math.round(top / 1200) + 1;
    if (pageNo !== currentPage) {
      setCurrentPage(pageNo);
    }
  };

  const onPageChange = useCallback((num: number) => {
    setCurrentPage(num);
    scrollbarRef.current?.scrollTop((num - 1) * 1200);
  }, []);

  return (
    <div className="sinoui-pdf-viewer-wrapper">
      <ToolBar>
        <span>{fileTitle}</span>
        <PageNumber
          onPageChange={onPageChange}
          currentPage={currentPage}
          total={pages}
        />
        <ToolbarActions>
          <div
            title="附加批注"
            onClick={() => onAddAdditionalNoteClick('additional')}
            className={classNames('sinoui-pdf-viewer-wrapper__icon-wrapper', {
              'sinoui-pdf-viewer-wrapper__icon-wrapper--select':
                annotationType === 'additional',
            })}
          >
            <MessageIcon title="附加批注" />
          </div>

          <div
            title="文字批注"
            onClick={() => onAddAdditionalNoteClick('text')}
            className={classNames('sinoui-pdf-viewer-wrapper__icon-wrapper', {
              'sinoui-pdf-viewer-wrapper__icon-wrapper--select':
                annotationType === 'text',
            })}
          >
            <TextIcon title="文字批注" />
          </div>

          <DownloadButton url={url} strictMode={strictMode} />
        </ToolbarActions>
      </ToolBar>
      {loading && (
        <Line percent={progress} strokeWidth={0.3} trailWidth={0.3} />
      )}
      <Scrollbars
        ref={scrollbarRef}
        onScroll={onScroll}
        className="sinoui-pdf-viewer-content__scrollbar"
      >
        <div
          ref={pdfContainerRef}
          className={classNames('sinoui-pdf-viewer-content', {
            'strict-mode': strictMode,
          })}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        >
          <Document
            file={url}
            onLoadSuccess={handleDocumentLoadSuccess}
            loading={<></>}
            error={<div>加载文件失败</div>}
            onLoadProgress={onLoadProgress}
            options={options}
          >
            {Array.from(new Array(pages), (_el, index) => (
              <Page
                key={index}
                pageNumber={index + 1}
                width={816}
                onClick={(event: React.MouseEvent) => handlePageClick(event)}
              />
            ))}

            {commonAnnotation.map((annotation) => (
              <PdfComment
                key={annotation.id}
                annotation={annotation}
                defaultOpen={newAnnotations.includes(annotation.id)}
                defaultFocus={newAnnotations.includes(annotation.id)}
                onChange={handleCommentChange}
                onRemove={handleCommentRemove}
              />
            ))}

            {textAnnotation.map((annotation) => (
              <PdfTextComment
                key={annotation.id}
                annotation={annotation}
                defaultOpen={newAnnotations.includes(annotation.id)}
                defaultFocus={current === annotation.id}
                onChange={handleCommentChange}
                onClose={() => setCurrent(undefined)}
              />
            ))}
          </Document>
        </div>
      </Scrollbars>
    </div>
  );
}
