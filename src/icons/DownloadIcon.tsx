import classNames from 'classnames';
import React from 'react';
import SvgIcon, { SvgIconProps } from './SvgIcon';

export default function DownloadIcon(props: SvgIconProps) {
  const { className, ...other } = props;
  return (
    <SvgIcon className={classNames('svg-icon-message', className)} {...other}>
      <path
        d="M640 145.664V298.666667h153.002667L640 145.664zM810.666667 384h-170.666667a85.333333 85.333333 0 0 1-85.333333-85.333333V128H213.333333v768h597.333334V384zM213.333333 42.666667h444.330667L896 281.002667V896a85.333333 85.333333 0 0 1-85.333333 85.333333H213.333333a85.333333 85.333333 0 0 1-85.333333-85.333333V128a85.333333 85.333333 0 0 1 85.333333-85.333333z m256 579.669333V426.666667h85.333334v195.669333l55.168-55.168 60.330666 60.330667L512 785.664l-158.165333-158.165333 60.330666-60.330667L469.333333 622.336z"
        p-id="16088"
      />
    </SvgIcon>
  );
}
