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
  undo,
  redo,
  showPopup,
  zoomOutOf,
  startSync,
  Action
} from '../actions';

export interface Props {
  readonly dispatch: Dispatch<Action>;
  readonly currentComponentName: string;
  readonly currentComponentRepo: string;
  readonly tickInterval: number;
  readonly gateCount: number;
  readonly undoCount: number;
  readonly redoCount: number;
  readonly isLoading: boolean;
  readonly isSaving: boolean;
  readonly isReadOnly: boolean;
  readonly isChildContext: boolean;
  readonly user: OauthData | null;
  readonly showMainMenu: boolean;
  readonly showSearchMenu: boolean;
  toggleMainMenu(e: any): void;
  toggleSearchMenu(e: any): void;
}

export default reax(
  {
    toggleSimulationMenu: constant(),
    onUndo: constant(),
    onRedo: constant(),
    onSetTickInterval: (value: number) => value,
    onStepForward: constant(),
    goBack: constant(),
    sync: constant(),
    onShare: constant()
  }, ({
    toggleSimulationMenu,
    onUndo,
    onRedo,
    onSetTickInterval,
    onStepForward,
    goBack,
    sync,
    onShare
  }, _, { dispatch }: Props) => {
    onUndo.subscribe(() => dispatch(undo()));
    onRedo.subscribe(() => dispatch(redo()));
    onSetTickInterval.subscribe(x => dispatch(setTickInterval(x)));
    onStepForward.subscribe(() => dispatch(stepForward()));
    goBack.subscribe(() => dispatch(zoomOutOf()));
    sync.subscribe(() => dispatch(startSync()));
    onShare.subscribe(() => dispatch(showPopup('Share')));

    const state = merge(
      toggleSimulationMenu.pipe(map(_ => 'simulation'))
    )
      .pipe(
        scan((state, event) => state === event ? '' : event, ''),
        share()
      );

    return {
      showSearch: state.pipe(
        is('search')),
      showSimulationMenu: state.pipe(
        is('simulation'))
    };
  },
  (values, events, props) => (
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
          goBack={events.goBack} />
        <SimulationMenuButton
          onClick={events.toggleSimulationMenu}
          isActive={values.showSimulationMenu} />
        <SearchButton
          showSearch={props.showSearchMenu}
          toggleSearch={props.toggleSearchMenu} />
      </div>
      <SimulationMenu
        show={values.showSimulationMenu}
        tickInterval={props.tickInterval}
        undoCount={props.undoCount}
        redoCount={props.redoCount}
        canShare={props.currentComponentRepo == '' && props.user != null}
        setTickInterval={events.onSetTickInterval}
        stepForward={events.onStepForward}
        undo={events.onUndo}
        redo={events.onRedo}
        share={events.onShare} />
    </div>
  ));

function is<T>(value: T) {
  return map(x => x === value);
}


