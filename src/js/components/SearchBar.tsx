import * as React from 'react';

import pure from './pure';

import style from './navbar.scss';
import { MdSearch } from 'react-icons/lib/md';

export type EventCallback<T> = (event : T) => void;

export default pure(
  (prev, next) =>
    prev.currentComponentName != next.currentComponentName
    || prev.showSearch != next.showSearch,
  (props : {
    currentComponentName : string,
    showSearch : boolean,
    toggleSearch : EventCallback<React.SyntheticEvent<HTMLButtonElement>>,
    query : EventCallback<React.SyntheticEvent<HTMLInputElement>>
  }) => (
  <div className={style.searchBar} data-state={props.showSearch ? 'search' : 'name'}>
    <div className={style.nameBox}>
      <span>{props.currentComponentName}</span>
    </div>
    <button
      className={style.navbarButton}
      data-active={props.showSearch}
      onClick={props.toggleSearch}>
        <MdSearch />
    </button>
    <div className={style.searchBox}>
      {props.showSearch
      ? <input
          autoFocus
          onChange={props.query} />
      : null}
    </div>
  </div>
));