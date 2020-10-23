import React, { useImperativeHandle, useRef, useState } from 'react';
import CustomScrollbar from 'react-custom-scrollbars';
import classNames from 'classnames';
import { PdfAnnotationType } from './pdfTypes';
import MessageIcon from './icons/MessageIcon';
import CloseIcon from './icons/CloseIcon';
import './PdfCommentBox.css';

interface Props {
  annotation: PdfAnnotationType;
  open: boolean;
  onClose: () => void;
  onBlur?: () => void;
  onFocus?: () => void;
  style?: React.CSSProperties;
  onChange?: (value: string) => void;
}

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
      <div
        className="sinoui-pdf-comment-box-wrapper"
        style={{ ...posStyle, ...style }}
      >
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
      </div>
    ) : null;
  },
);

export default PdfCommentBox;
