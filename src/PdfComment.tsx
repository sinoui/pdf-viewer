import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { PdfAnnotationType } from './pdfTypes';
import PdfCommentBox from './PdfCommentBox';
import MessageIcon from './icons/MessageIcon';

const Wrapper = styled.div`
  display: inline-block;
  background-color: #f9f1af;
  padding: 0px 4px;
  font-size: 20px;
  border: 1px solid black;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  outline: none;
  position: absolute;
  left: 0;
  top: 0;
  cursor: move;

  &:focus {
    background-color: #f3e577;
  }
`;

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

  const handleStop = (_event, { lastX, lastY }) => {
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
        <Wrapper onClick={handleIconClick} tabIndex={0} onKeyUp={handleKeyUp}>
          <MessageIcon />
        </Wrapper>
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
