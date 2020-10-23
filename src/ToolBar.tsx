import React from 'react';
import './ToolBar.css';

export interface Props {
  children?: React.ReactNode;
}

export default function ToolBar(props: Props) {
  const { children } = props;
  return <div className="sinoui-pdf-viewer-toobar">{children}</div>;
}
