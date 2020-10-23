import classNames from 'classnames';
import React from 'react';
import SvgIcon, { SvgIconProps } from './SvgIcon';

export default function MessageIcon(props: SvgIconProps) {
  const { className, ...other } = props;
  return (
    <SvgIcon className={classNames('svg-icon-message', className)} {...other}>
      <path
        d="M496.155266 1024h-284.781065a30.295858 30.295858 0 0 1 0-60.591716h284.781065a30.295858 30.295858 0 0 1 0 60.591716z"
        p-id="7214"
      />
      <path
        d="M353.764734 1011.881657a30.295858 30.295858 0 0 1-30.295858-30.295858V30.295858a30.295858 30.295858 0 0 1 60.591716 0v951.289941a30.295858 30.295858 0 0 1-30.295858 30.295858z"
        p-id="7215"
      />
      <path
        d="M670.477633 203.648757a30.295858 30.295858 0 0 1-30.295858-30.295858V60.591716H67.347692v112.761183a30.295858 30.295858 0 0 1-60.591716 0V30.295858a30.295858 30.295858 0 0 1 30.295858-30.295858h633.425799a30.295858 30.295858 0 0 1 30.295858 30.295858v143.057041a30.295858 30.295858 0 0 1-30.295858 30.295858zM986.948166 733.159763h-345.372781a30.295858 30.295858 0 1 1 0-60.591716h345.372781a30.295858 30.295858 0 0 1 0 60.591716zM986.948166 884.639053h-345.372781a30.295858 30.295858 0 1 1 0-60.591716h345.372781a30.295858 30.295858 0 0 1 0 60.591716zM986.948166 1024h-345.372781a30.295858 30.295858 0 1 1 0-60.591716h345.372781a30.295858 30.295858 0 0 1 0 60.591716z"
        p-id="7216"
      />
    </SvgIcon>
  );
}
