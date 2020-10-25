import React, { useState, useEffect, useRef, useMemo } from 'react';
import Draggable from 'react-draggable';
import { PdfAnnotationType } from './pdfTypes';
import PdfCommentBox from './PdfCommentBox';
import MessageIcon from './icons/MessageIcon';
import './PdfComment.css';
import Line from './icons/Line';

interface Props {
  annotation: PdfAnnotationType;
  defaultOpen?: boolean;
  defaultFocus?: boolean;
  onChange?: (annotation: PdfAnnotationType) => void;
  onRemove?: (annotation: PdfAnnotationType) => void;
}

/**
 * pdf批注
 */
function PdfComment({
  annotation,
  defaultOpen = false,
  defaultFocus,
  onChange,
  onRemove,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const boxRef = useRef<{ focus: Function }>(null);

  useEffect(() => {
    if (defaultFocus) {
      boxRef.current?.focus();
    }
    // 注意：这里不要监听 defaultFocus 的变更
  }, []);

  const [isShowLine, setIsShowLine] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const handleIconClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (!isOpen) {
      setIsOpen(true);
      boxRef.current?.focus();
    }
    setIsShowLine(true);
  };

  const handleContentChange = (content: string) => {
    if (onChange) {
      onChange({
        ...annotation,
        content,
      });
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    const code = event.key;
    if (code === 'Delete' && onRemove) {
      onRemove(annotation);
    }
  };

  const handleDrag = () => {
    setIsMoving(true);
  };

  const handleStop = (
    _event: any,
    { lastX, lastY }: { lastX: number; lastY: number },
  ) => {
    setIsMoving(false);
    if (onChange) {
      onChange({
        ...annotation,
        x: Math.round(lastX),
        y: Math.round(lastY),
      });
    }
  };

  const handleFocus = () => {
    setIsShowLine(true);
  };

  const handleBlur = () => {
    setIsShowLine(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsShowLine(false);
  };

  const startPonit = useMemo(() => ({ x: annotation.x, y: annotation.y }), [
    annotation,
  ]);
  const targetPoint = useMemo(() => ({ x: 816, y: annotation.y + 20 }), [
    annotation,
  ]);

  return (
    <>
      <Draggable
        onDrag={handleDrag}
        onStop={handleStop}
        defaultPosition={{ x: annotation.x, y: annotation.y }}
      >
        <div
          role="button"
          onClick={handleIconClick}
          tabIndex={0}
          onKeyUp={handleKeyUp}
          className="sinoui-pdf-commemt-icon-wrapper"
          onBlur={handleBlur}
        >
          <MessageIcon />
        </div>
      </Draggable>
      {isMoving && (
        <div
          className="sinoui-pdf-commemt-icon-wrapper--isMoving"
          style={{
            transform: `translate(${annotation.x}px,${annotation.y}px)`,
          }}
        >
          <MessageIcon />
        </div>
      )}
      {isShowLine && <Line startPoint={startPonit} targetPoint={targetPoint} />}
      <PdfCommentBox
        annotation={annotation}
        open={isOpen}
        onClose={handleClose}
        ref={boxRef}
        onChange={handleContentChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </>
  );
}

export default PdfComment;
