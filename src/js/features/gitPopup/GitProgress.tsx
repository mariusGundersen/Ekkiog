import * as React from 'react';

import style from './gitProgress.scss';
import { GitPopupState } from './reduce';

export default (props : GitPopupState) => (
  <div className={style.gitProgress+' '+style[props.status]}>
    <pre>{props.message}</pre>
  </div>
);