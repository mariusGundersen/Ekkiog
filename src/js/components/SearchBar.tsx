import * as React from 'react';

import pure from './pure';

import style from './navbar.scss';
import theme from './theme.scss';
import SearchIcon from 'react-icons/fa/search';
import CreateNewComponentIcon from 'react-icons/fa/plus-circle';
import SavingIcon from 'react-icons/fa/spinner';
import GoBackIcon from 'react-icons/fa/chevron-circle-left';
import { Transition } from 'react-transition-group';

import DelayEnterExit from './DelayEnterExit';

export interface Props {
  readonly currentComponentName : string,
  readonly currentComponentRepo : string,
  readonly gateCount : number,
  readonly showSearch : boolean,
  readonly toggleSearch : EventCallback<React.SyntheticEvent<HTMLElement>>,
  readonly query : EventCallback<string>,
  readonly isSaving : boolean,
  readonly canGoBack : boolean
  readonly goBack : EventCallback<React.SyntheticEvent<HTMLElement>>
};

export type EventCallback<T> = (event : T) => void;

export default pure((prev, next) => (
    prev.currentComponentName != next.currentComponentName ||
    prev.currentComponentRepo != next.currentComponentRepo ||
    prev.showSearch != next.showSearch ||
    prev.gateCount != next.gateCount ||
    prev.isSaving != next.isSaving
  ),
  (props : Props) => (
  <div className={style.searchBar}>
    <div className={style.container} data-state={props.showSearch ? 'search' : 'name'}>
        {props.canGoBack ?
          <button
            onClick={props.goBack}
            className={style.navbarButton}>
            <span className={theme.icon} >
              <GoBackIcon />
            </span>
          </button> :
          <button className={style.navbarButton}>
            <span className={theme.icon} />
          </button>
        }
      <div className={style.nameBox} onClick={props.toggleSearch}>
        <span>{props.currentComponentName} {props.gateCount > 0 && `(${props.gateCount})`}</span>
        {props.currentComponentRepo && <span className={style.repo}>{props.currentComponentRepo}</span>}
      </div>
      <SearchButton
        showSearch={props.showSearch}
        toggleSearch={props.toggleSearch}
        isSaving={props.isSaving} />
      <div className={style.searchBox}>
        <DelayEnterExit
          show={props.showSearch}
          enterDelay={300} >
          <input
              type="text"
              size={2}
              autoFocus
              onChange={limitInput(props.query)} />
        </DelayEnterExit>
      </div>
    </div>
  </div>
));

const SearchButton = pure((prev, next) => (
    prev.isSaving !== next.isSaving ||
    prev.showSearch !== next.showSearch
  ),
  (props : {showSearch : boolean, toggleSearch : EventCallback<any>, isSaving : boolean}) => (
  <button
    className={style.navbarButton}
    data-active={props.showSearch}
    onClick={props.toggleSearch}>
    <Transition
      in={props.isSaving}
      timeout={{enter: 50, exit: 50}}>
      {(state : string) => <span className={state == 'entered' ? theme.spinningIcon : theme.icon}>
        {state == 'entered'
          ? <SavingIcon />
          :  <SearchIcon />}
      </span>}
    </Transition>
  </button>
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
