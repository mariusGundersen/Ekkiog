import * as React from 'react';

import pure from './pure';

import style from './mainMenu.scss';

import storage from '../storage';

export interface Props {

}

export default pure((a, b) => true,
  (props : Props) => (
  <div
    className={style.mainMenu}>
    <div className={style.version}>
      Version: {__BuildDate__}
    </div>
  </div>
));
