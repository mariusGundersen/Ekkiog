import * as React from 'react';
import reax, { constant } from 'reaxjs';
import { Dispatch } from 'redux';
import { Observable, merge, of } from 'rxjs';
import {
  map,
  scan,
  share,
  startWith,
  switchMap,
  withLatestFrom,
  delayWhen,
  delay
} from 'rxjs/operators';
import { Package } from '../editing';

import MainMenuButton from './MainMenuButton';
import SearchResults from './SearchResults';
import SimulationMenuButton from './SimulationMenuButton';
import SimulationMenu from './SimulationMenu';
import MainMenu from '../features/mainMenu';
import SearchBar from './SearchBar';

import style from './navbar.scss';

import {
  insertComponentPackage,
  loadForest,
  setTickInterval,
  stepForward,
  undo,
  redo,
  createForest,
  showPopup,
  zoomOutOf,
  startSync,
  Action
} from '../actions';
import { RepoName } from './SearchResultView';
import DelayEnterExit from './DelayEnterExit';

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
  toggleMainMenu(e: any): void;
}

export default reax(
  {
    toggleSearch: constant(),
    toggleSimulationMenu: constant(),
    query: (value: string) => value,
    insertPackage: (result: Package) => result,
    openComponent: (result: RepoName) => result,
    createComponent: (result: string) => result,
    onUndo: constant(),
    onRedo: constant(),
    onSetTickInterval: (value: number) => value,
    onStepForward: constant(),
    goBack: constant(),
    sync: constant(),
    onShare: constant()
  }, ({
    toggleSearch,
    toggleSimulationMenu,
    query,
    insertPackage,
    openComponent,
    createComponent,
    onUndo,
    onRedo,
    onSetTickInterval,
    onStepForward,
    goBack,
    sync,
    onShare
  }, _, { dispatch }: Props) => {
    insertPackage.subscribe(r => dispatch(insertComponentPackage(r)));
    openComponent.subscribe(r => dispatch(loadForest(r.repo, r.name)));
    createComponent.subscribe(r => dispatch(createForest(r)));
    onUndo.subscribe(() => dispatch(undo()));
    onRedo.subscribe(() => dispatch(redo()));
    onSetTickInterval.subscribe(x => dispatch(setTickInterval(x)));
    onStepForward.subscribe(() => dispatch(stepForward()));
    goBack.subscribe(() => dispatch(zoomOutOf()));
    sync.subscribe(() => dispatch(startSync()));
    onShare.subscribe(() => dispatch(showPopup('Share')));

    const showSearch = merge(
      toggleSearch,
      insertPackage.pipe(map(() => true)),
      openComponent.pipe(map(() => true)),
      createComponent.pipe(map(() => true))
    );

    const state = merge(
      showSearch.pipe(map(_ => 'search')),
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
        is('simulation')),
      query: state.pipe(
        is('search'),
        switchMap(ifElse(query.pipe(startWith('')), '')))
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
          showSearch={values.showSearch}
          toggleSearch={events.toggleSearch}
          isSaving={props.isSaving}
          query={events.query}
          canGoBack={props.isChildContext}
          goBack={events.goBack} />
        <SimulationMenuButton
          onClick={events.toggleSimulationMenu}
          isActive={values.showSimulationMenu} />
      </div>
      <DelayEnterExit
        show={values.showSearch}
        enterDelay={150}>
        <SearchResults
          query={values.query}
          insertPackage={events.insertPackage}
          openComponent={events.openComponent}
          createComponent={events.createComponent}
          isReadOnly={props.isReadOnly} />
      </DelayEnterExit>
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

function ifElse<T>(observable: Observable<T>, fallback: T) {
  return (condition: boolean) => condition ? observable : of(fallback);
}

