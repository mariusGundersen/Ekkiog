import * as React from 'react';

import pure from './pure';

import style from './navbar.scss';
import theme from './theme.scss';
import MdSearch from 'react-icons/md/search';
import FaBusy from 'react-icons/fa/spinner';
import { Transition } from 'react-transition-group';

export type EventCallback<T> = (event : T) => void;

export default pure(
  (prev, next) =>
    prev.currentComponentName != next.currentComponentName
    || prev.currentComponentRepo != next.currentComponentRepo
    || prev.showSearch != next.showSearch
    || prev.gateCount != next.gateCount
    || prev.isSaving != next.isSaving,
  (props : {
    currentComponentName : string,
    currentComponentRepo : string,
    gateCount : number,
    showSearch : boolean,
    toggleSearch : EventCallback<React.SyntheticEvent<HTMLButtonElement>>,
    query : EventCallback<string>,
    isSaving : boolean
  }) => (
  <div className={style.searchBar} data-state={props.showSearch ? 'search' : 'name'}>
    <div className={style.nameBox}>
      <span>{props.currentComponentName} ({props.gateCount})</span>
      {props.currentComponentRepo && <span className={style.repo}>{props.currentComponentRepo}</span>}
    </div>
    <button
      className={style.navbarButton}
      data-active={props.showSearch}
      onClick={props.toggleSearch}>
      <Transition
        in={props.isSaving}
        timeout={{enter: 50, exit: 50}}>
        {(state : string) => <span className={state == 'entered' ? theme.spinningIcon : theme.icon}>
          {state == 'entered'
            ? <FaBusy />
            :  <MdSearch />}
        </span>}
      </Transition>
    </button>
    <div className={style.searchBox}>
      {props.showSearch
      ? <input
          type="text"
          size={2}
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