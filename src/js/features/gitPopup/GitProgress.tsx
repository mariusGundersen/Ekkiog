import * as React from 'react';

import FaBusy from 'react-icons/fa/spinner';
import FaSuccess from 'react-icons/fa/check';
import FaFailure from 'react-icons/fa/exclamation-triangle';

import theme from '../../components/theme.scss';
import style from './gitProgress.scss';
import { GitPopupState } from './reduce';

export interface ClickToHide{
  hidePopup(e : React.MouseEvent<HTMLDivElement>) : void
}

export default (props : GitPopupState & ClickToHide) => (
  <div className={style.gitProgress+' '+style[props.status]} onClick={props.hidePopup}>
    {props.status === 'busy' ?
      <div className={[theme.spinningIcon, style.busyIcon].join(' ')}>
        <FaBusy />
      </div>
    : props.status === 'success' ?
      <div className={[theme.icon, style.successIcon].join(' ')}>
        <FaSuccess />
      </div>
    :
      <div className={[theme.icon, style.failureIcon].join(' ')}>
        <FaFailure />
      </div>
    }
    <pre>{props.message}</pre>
  </div>
);