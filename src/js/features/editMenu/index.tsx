import * as React from 'react';
import style from './editMenu.scss';
import theme from '../../components/theme.scss';
import IconButton from '../../components/icons/IconButton';
import IconGate from '../../components/icons/IconGate';
import IconLight from '../../components/icons/IconLight';

export interface Props {

}

export default (props: Props) => (
  <div className={style.editMenu}>
    <button className={theme.icon}>
      <svg viewBox="-24 -24 48 48" width="32" height="32">
        <IconButton />
      </svg>
    </button>
    <button className={theme.icon}>
      <svg viewBox="-24 -24 48 48" width="32" height="32">
        <IconGate />
      </svg>
    </button>
    <button className={theme.icon}>
      <svg viewBox="-24 -24 48 48" width="32" height="32">
        <IconLight />
      </svg>
    </button>
    <button className={theme.icon}>
      <svg viewBox="-24 -24 48 48" width="32" height="32">
        <IconButton />
      </svg>
    </button>
  </div>
);
