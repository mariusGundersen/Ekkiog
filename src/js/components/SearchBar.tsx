import * as React from 'react';

import pure from './pure';

import style from './navbar.scss';
import MdSearch from 'react-icons/md/search';

export type EventCallback<T> = (event : T) => void;

export default pure(
  (prev, next) =>
    prev.currentComponentName != next.currentComponentName
    || prev.showSearch != next.showSearch,
  (props : {
    currentComponentName : string,
    showSearch : boolean,
    toggleSearch : EventCallback<React.SyntheticEvent<HTMLButtonElement>>,
    query : EventCallback<string>
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
          onChange={limitInput(props.query)} />
      : null}
    </div>
  </div>
));

function limitInput(handle : (value : string) => void){
  return (event : React.SyntheticEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, '-');
    event.currentTarget.value = value;
    handle(value);
  };
}