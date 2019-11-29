import * as React from 'react';
import reax, { constant } from 'reaxjs';
import { Dispatch } from 'redux';
import { merge } from 'rxjs';
import {
  map,
  scan,
  share
} from 'rxjs/operators';

import MainMenuButton from './MainMenuButton';
import SimulationMenuButton from './SimulationMenuButton';
import SimulationMenu from './SimulationMenu';
import SearchBar, { SearchButton } from './SearchBar';

import style from './navbar.scss';

import {
  setTickInterval,
  stepForward,
  rewind,
  showPopup,
  zoomOutOf,
  Action,
  toggleShow
} from '../actions';

export interface Props {
  readonly dispatch: Dispatch<Action>;
  readonly currentComponentName: string;
  readonly currentComponentRepo: string;
  readonly tickInterval: number;
  readonly gateCount: number;
  readonly isLoading: boolean;
  readonly isSaving: boolean;
  readonly isReadOnly: boolean;
  readonly isChildContext: boolean;
  readonly user: OauthData | null;
  readonly showMainMenu: boolean;
  readonly showSearchMenu: boolean;
  readonly showSimulationMenu: boolean;
  readonly showTestScenario: boolean;
  toggleMainMenu(e: any): void;
  toggleSearchMenu(e: any): void;
}

export default function (props: Props) {
  const dispatch = props.dispatch;

  return (
    <div className={style.navbar}>
      <div className={style.bar} data-loading={props.isLoading}>
        <MainMenuButton
          isActive={props.showMainMenu}
          onClick={props.toggleMainMenu} />
        <SearchBar
          currentComponentName={props.currentComponentName}
          currentComponentRepo={props.currentComponentRepo}
          gateCount={props.gateCount}
          isSaving={props.isSaving}
          canGoBack={props.isChildContext}
          goBack={() => dispatch(zoomOutOf())} />
        <SimulationMenuButton
          onClick={() => dispatch(toggleShow(!props.showSimulationMenu))}
          isActive={props.showSimulationMenu} />
        <SearchButton
          showSearch={props.showSearchMenu}
          toggleSearch={props.toggleSearchMenu} />
      </div>
      <SimulationMenu
        show={props.showSimulationMenu}
        testScenario={props.showTestScenario}
        tickInterval={props.tickInterval}
        canShare={props.currentComponentRepo == '' && props.user != null}
        setTickInterval={x => dispatch(setTickInterval(x))}
        stepForward={() => dispatch(stepForward())}
        rewind={() => dispatch(rewind())}
        share={() => dispatch(showPopup('Share'))} />
    </div>
  );
}

