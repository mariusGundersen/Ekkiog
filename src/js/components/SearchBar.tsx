import * as React from 'react';

import pure from './pure';

import style from './navbar.scss';
import theme from './theme.scss';
import SearchIcon from 'react-icons/fa/search';
import SavingIcon from 'react-icons/fa/spinner';
import GoBackIcon from 'react-icons/fa/chevron-circle-left';
import { Transition } from 'react-transition-group';

import DelayEnterExit from './DelayEnterExit';

export interface Props {
  readonly currentComponentName: string,
  readonly currentComponentRepo: string,
  readonly gateCount: number,
  readonly showSearch: boolean,
  readonly toggleSearch: EventCallback<React.SyntheticEvent<HTMLElement>>,
  readonly query: EventCallback<string>,
  readonly isSaving: boolean,
  readonly canGoBack: boolean
  readonly goBack: EventCallback<React.SyntheticEvent<HTMLElement>>
};

export type EventCallback<T> = (event: T) => void;

export default pure(['currentComponentName', 'currentComponentRepo', 'showSearch', 'gateCount', 'isSaving'],
  (props: Props) => (
    <div className={style.searchBar}>
      <div className={style.container} data-state={props.showSearch ? 'search' : 'name'}>
        <GoBackButton
          canGoBack={props.canGoBack}
          isSaving={props.isSaving}
          goBack={props.goBack} />
        <div className={style.nameBox} onClick={props.toggleSearch}>
          <span className={style.name}>{props.currentComponentName}</span>
          {props.currentComponentRepo && <span className={style.repo}>{props.currentComponentRepo}</span>}
        </div>
        <SearchButton
          showSearch={props.showSearch}
          toggleSearch={props.toggleSearch} />
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

const SearchButton = pure(['showSearch'],
  (props: { showSearch: boolean, toggleSearch: EventCallback<any> }) => (
    <button
      className={style.navbarButton}
      data-active={props.showSearch}
      onClick={props.toggleSearch}>
      <span className={theme.icon}>
        <SearchIcon />
      </span>
    </button>
  ));

const GoBackButton = pure(['isSaving', 'canGoBack'],
  (props: { isSaving: boolean, canGoBack: boolean, goBack: EventCallback<any> }) => (
    <Transition
      in={props.isSaving}
      timeout={{ enter: 50, exit: 50 }}>
      {(state: string) => {
        if (state === 'entered') {
          return <button className={style.navbarButton}>
            <span className={theme.spinningIcon}>
              <SavingIcon />
            </span>
          </button>
        } else if (props.canGoBack) {
          return <button
            onClick={props.goBack}
            className={style.navbarButton}>
            <span className={theme.icon} >
              <GoBackIcon />
            </span>
          </button>;
        } else {
          return <button className={style.navbarButton}>
            <span className={theme.icon} />
          </button>;
        }
      }}
    </Transition>
  ));

function limitInput(handle: (value: string) => void) {
  return (event: React.SyntheticEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, '-');
    event.currentTarget.value = value;
    handle(value);
  };
}
