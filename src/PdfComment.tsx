import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { PdfAnnotationType } from './pdfTypes';
import PdfCommentBox from './PdfCommentBox';
import MessageIcon from './icons/MessageIcon';
import './PdfComment.css';

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

  const handleIconClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (!isOpen) {
      setIsOpen(true);
      boxRef.current?.focus();
    }
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

  const handleStop = (
    _event: any,
    { lastX, lastY }: { lastX: number; lastY: number },
  ) => {
    if (onChange) {
      onChange({
        ...annotation,
        x: Math.round(lastX),
        y: Math.round(lastY),
      });
    }
  };

  return (
    <>
      <Draggable
        onStop={handleStop}
        defaultPosition={{ x: annotation.x, y: annotation.y }}
      >
        <div
          role="button"
          onClick={handleIconClick}
          tabIndex={0}
          onKeyUp={handleKeyUp}
          className="sinoui-pdf-commemt-icon-wrapper"
        >
          <MessageIcon />
        </div>
      </Draggable>
      <PdfCommentBox
        annotation={annotation}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        ref={boxRef}
        onChange={handleContentChange}
      />
    </>
  );
}

export default PdfComment;
