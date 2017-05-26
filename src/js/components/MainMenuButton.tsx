import * as React from 'react';

import style from './navbar.scss';

import MdMenu from 'react-icons/md/menu';

export default (props : {onClick : (event : React.SyntheticEvent<HTMLButtonElement>) => void}) => (
  <button
    className={style.navbarButton}
    onClick={props.onClick}>
    <MdMenu />
  </button>
);
