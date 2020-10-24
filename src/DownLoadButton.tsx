/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import DownloadIcon from './icons/DownloadIcon';
import './DownloadButton.css';

interface DownLoadProps {
  /**
   * 文件路径
   */
  url: string;
  /**
   * 严格模式
   */
  strictMode: boolean;
}

export default function DownLoadButton({ url, strictMode }: DownLoadProps) {
  return (
    <div
      title="下载"
      role="button"
      tabIndex={-3}
      className="sinoui-pdf-viewer-wrapper__icon-wrapper"
    >
      <a
        className="sinoui-pdf-download"
        download
        href={strictMode ? 'javascript:void(0);' : url}
      >
        <DownloadIcon title="下载" />
      </a>
    </div>
  );
}
