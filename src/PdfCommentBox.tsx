import React, { useImperativeHandle, useRef, useState } from 'react';
import styled from 'styled-components';
import CustomScrollbar from 'react-custom-scrollbars';
import classNames from 'classnames';
import { PdfAnnotationType } from './pdfTypes';
import MessageIcon from './icons/MessageIcon';
import CloseIcon from './icons/CloseIcon';

interface Props {
  annotation: PdfAnnotationType;
  open: boolean;
  onClose: () => void;
  onBlur?: () => void;
  onFocus?: () => void;
  style?: React.CSSProperties;
  onChange?: (value: string) => void;
}

const BoxWrapper = styled.div`
  width: 260px;
  height: 180px;
  border: 1px solid black;
  box-sizing: border-box;
  background-color: white;
  right: -262px;
  position: absolute;
  background-color: #f4e9d6;
  transform: translateY(-15px);
  &:hover {
    background-color: #fff4e0;
  }
  padding: 8px;

  & .editor {
    padding: 4px;
    height: 98px;
    box-sizing: border-box;
    border: 1px solid transparent;

    &.is-focused {
      border-color: rgba(0, 0, 0, 0.38);
      outline: none;
      background: white;
    }

    .editor-inner {
      outline: none;
      min-height: 88px;
    }
  }

  & .close-btn {
    position: absolute;
    top: 4px;
    right: 4px;
  }

  & .pdf-comment-username {
    display: inline-block;
    padding-left: 8px;
  }

  .svg-icon-message {
    font-size: 20px;
    width: 20px;
    height: 20px;
  }
`;

/**
 * pdf批注盒子
 */
const PdfCommentBox = React.forwardRef<{ focus: Function }, Props>(
  function PdfCommentBox({ annotation, open, onClose, style, onChange }, ref) {
    const [isFocused, setIsFocused] = useState(false);

    const posStyle: React.CSSProperties = {
      top: annotation.y,
      zIndex: isFocused ? 1000 : 1,
    };

    const editorRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => editorRef.current?.focus(),
      }),
      [],
    );

    return open ? (
      <BoxWrapper style={{ ...posStyle, ...style }}>
        <div>
          <MessageIcon />
          <span className="pdf-comment-username">{annotation.creator}</span>
        </div>
        <div>{annotation.createTime}</div>
        <CloseIcon onClick={onClose} className="close-btn" />
        <hr />
        <div className={classNames('editor', { 'is-focused': isFocused })}>
          <CustomScrollbar>
            <div
              className="editor-inner"
              contentEditable
              dangerouslySetInnerHTML={{
                __html: annotation.content,
              }}
              ref={editorRef}
              onBlur={() => setIsFocused(false)}
              onFocus={(event) => {
                setIsFocused(true);
                if (onChange) {
                  onChange(event.currentTarget.innerHTML);
                }
              }}
            />
          </CustomScrollbar>
        </div>
      </BoxWrapper>
    ) : null;
  },
);

export default PdfCommentBox;
