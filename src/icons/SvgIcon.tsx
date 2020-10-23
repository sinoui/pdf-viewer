import React from 'react';
import classNames from 'classnames';
import './SvgIcon.css';

export interface SvgIconProps {
  /**
   * 指定图标内容
   */
  children?: React.ReactNode;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 指定自定义样式
   */
  style?: React.CSSProperties;
  /**
   * 设置 svg 元素的 viewBox，默认为0 0 24 24
   */
  viewBox?: string;
  /**
   * 设置图标大小。数字或者字符串。如果是数字，则单位是像素
   */
  size?: number | string;
  /**
   * 设置颜色
   */
  color?: string;
  /**
   * 指定图标的标题
   */
  title?: string;
  /**
   * 不设置图标大小。一般用于`<SvgIcon as={CustomIcon} disabledViewBox />`，这种情况下，CustomIcon已有了`viewBox`。
   */
  disabledViewBox?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}

export default function SvgIcon(props: SvgIconProps) {
  const { className, children, ...other } = props;
  return (
    <svg
      viewBox="0 0 1024 1024"
      className={classNames('svg-icon', className)}
      {...other}
    >
      {children}
    </svg>
  );
}
