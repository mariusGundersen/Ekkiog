import * as React from 'react';

import MenuIcon from 'react-icons/fa/sliders';

import style from './navbar.scss';
import theme from './theme.scss';

export interface Props {
  readonly isActive: boolean,
  onClick(event: React.SyntheticEvent<HTMLButtonElement>): void
};

export default (props: Props) => (
  <button
    className={style.navbarButton}
    onClick={props.onClick}
    data-active={props.isActive}>
    <span className={theme.icon}>
      <MenuIcon />
    </span>
  </button>
);
