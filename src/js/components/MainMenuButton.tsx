import * as React from 'react';

import style from './navbar.scss';

import MdMenu from 'react-icons/md/menu';

export default (props : {}) => (
  <button className={style.navbarButton}><MdMenu /></button>
);
