import * as React from 'react';

import pure from './pure';

import style from './simulationMenu.scss';

export interface Props {

}

export default pure((a, b) => true,
  (props : Props) => (
  <div
    className={style.simulationMenu}>
    Version: {window.__BuildDate__}
  </div>
));