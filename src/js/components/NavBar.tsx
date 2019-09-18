import * as React from 'react';
import reax from 'reaxjs';
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
import { Package } from 'ekkiog-editing';

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
}

export default reax({
  toggleSearch: () => true,
  toggleSimulationMenu: () => true,
  toggleMainMenu: () => true,
  query: (value: string) => value,
  insertPackage: (result: Package) => result,
  openComponent: (result: RepoName) => result,
  createComponent: (result: string) => result,
  onUndo: () => true,
  onRedo: () => true,
  onSetTickInterval: (value: number) => value,
  onStepForward: () => true,
  goBack: () => true,
  sync: () => true,
  onShare: () => true
}, ({
  toggleSearch,
  toggleSimulationMenu,
  toggleMainMenu,
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
}, props, initialProps: Props) => {
    insertPackage.subscribe(r => initialProps.dispatch(insertComponentPackage(r)));
    openComponent.subscribe(r => initialProps.dispatch(loadForest(r.repo, r.name)));
    createComponent.subscribe(r => initialProps.dispatch(createForest(r)));
    onUndo.subscribe(() => initialProps.dispatch(undo()));
    onRedo.subscribe(() => initialProps.dispatch(redo()));
    onSetTickInterval.subscribe(x => initialProps.dispatch(setTickInterval(x)));
    onStepForward.subscribe(() => initialProps.dispatch(stepForward()));
    goBack.subscribe(() => initialProps.dispatch(zoomOutOf()));
    sync.subscribe(() => initialProps.dispatch(startSync()));
    onShare.pipe(withLatestFrom(props)).subscribe(([_,]) => initialProps.dispatch(showPopup('Share')));

    const showSearch = merge(
      toggleSearch,
      insertPackage.pipe(map(() => true)),
      openComponent.pipe(map(() => true)),
      createComponent.pipe(map(() => true))
    );

    const state = merge(
      showSearch.pipe(map(_ => 'search')),
      toggleSimulationMenu.pipe(map(_ => 'simulation')),
      toggleMainMenu.pipe(map(_ => 'main'))
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
      showMainMenu: state.pipe(
        is('main')),
      showMainMenuDelayed: state.pipe(
        is('main'),
        delayWhen(v => of(v).pipe(delay(v ? 0 : 150)))),
      query: state.pipe(
        is('search'),
        switchMap(ifElse(query.pipe(startWith('')), '')))
    };
  }, ({
    events,
    values,
    props
  }) => (
      <div className={style.navbar} data-main-menu={values.showMainMenuDelayed}>
        <div className={style.bar} data-loading={props.isLoading}>
          <MainMenuButton
            isActive={values.showMainMenu}
            onClick={events.toggleMainMenu} />
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
        <MainMenu
          show={values.showMainMenu}
          user={props.user}
          startSync={events.sync} />
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

