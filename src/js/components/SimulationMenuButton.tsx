import * as React from 'react';

import MdMenu from 'react-icons/fa/bars';

import style from './navbar.scss';

export interface Props {
  readonly isActive : boolean,
  readonly onClick : (event : React.SyntheticEvent<HTMLButtonElement>) => void
};

export default (props : Props) => (
  <button
    className={style.navbarButton}
    onClick={props.onClick}
    data-active={props.isActive}>
    <MdMenu />
  </button>
);