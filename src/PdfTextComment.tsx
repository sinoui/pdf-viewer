import React, { useState, useEffect, useRef } from 'react';
import { PdfAnnotationType } from './pdfTypes';
import PdfCommentBox from './PdfCommentBox';
import './PdfComment.css';

interface Props {
  annotation: PdfAnnotationType;
  defaultOpen?: boolean;
  defaultFocus?: boolean;
  onChange?: (annotation: PdfAnnotationType) => void;
  onClose?: () => void;
}

/**
 * pdf批注
 */
function PdfComment({
  annotation,
  defaultOpen = false,
  defaultFocus,
  onChange,
  onClose,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const boxRef = useRef<{ focus: Function }>(null);

  useEffect(() => {
    if (defaultFocus) {
      setIsOpen(true);
      boxRef.current?.focus();
    }
    // 注意：这里不要监听 defaultFocus 的变更
  }, [defaultFocus]);

  const handleContentChange = (content: string) => {
    if (onChange) {
      onChange({
        ...annotation,
        content,
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };
  return (
    <PdfCommentBox
      annotation={annotation}
      open={isOpen}
      onClose={handleClose}
      ref={boxRef}
      onChange={handleContentChange}
    />
  );
}

export default PdfComment;
