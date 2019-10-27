import * as React from 'react';

import pure from './pure';

import style from './navbar.scss';
import theme from './theme.scss';
import SearchIcon from 'react-icons/fa/search';
import SavingIcon from 'react-icons/fa/spinner';
import GoBackIcon from 'react-icons/fa/chevron-circle-left';
import { Transition } from 'react-transition-group';

export interface Props {
  readonly currentComponentName: string,
  readonly currentComponentRepo: string,
  readonly gateCount: number,
  readonly isSaving: boolean,
  readonly canGoBack: boolean
  readonly goBack: EventCallback<React.SyntheticEvent<HTMLElement>>
};

export type EventCallback<T> = (event: T) => void;

export default pure(['currentComponentName', 'currentComponentRepo', 'gateCount', 'isSaving', 'canGoBack'],
  (props: Props) => (
    <div className={style.searchBar}>
      <GoBackButton
        canGoBack={props.canGoBack}
        isSaving={props.isSaving}
        goBack={props.goBack} />
      <div className={style.nameBox}>
        <span className={style.name}>{props.currentComponentName}</span>
        {props.currentComponentRepo && <span className={style.repo}>{props.currentComponentRepo}</span>}
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

export { SearchButton };

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
