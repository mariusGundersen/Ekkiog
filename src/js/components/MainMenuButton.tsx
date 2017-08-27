import * as React from 'react';

import style from './navbar.scss';

import MdMenu from 'react-icons/md/menu';

export interface Props {
  readonly onClick : (event : React.SyntheticEvent<HTMLButtonElement>) => void
  readonly isActive : boolean
}

export default (props : Props) => (
  <button
    className={style.navbarButton}
    data-active={props.isActive}
    onClick={props.onClick}>
    <MdMenu />
  </button>
);
