import * as React from 'react';
import reax from 'reaxjs';
import { Dispatch } from 'redux';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';
import {
  map,
  scan,
  share,
  startWith,
  switchMap,
  withLatestFrom
} from 'rxjs/operators';
import { CompiledComponent } from 'ekkiog-editing';

import MainMenuButton from './MainMenuButton';
import SearchResults from './SearchResults';
import SimulationMenuButton from './SimulationMenuButton';
import SimulationMenu from './SimulationMenu';
import MainMenu from './MainMenu';
import SearchBar from './SearchBar';

import style from './navbar.scss';

import {
  insertComponentPackage,
  loadForest,
  setTickInterval,
  undo,
  redo,
  createForest,
  showPopup
} from '../actions';
import { State } from '../reduce';
import * as storage from '../storage';
import { RepoName } from './SearchResultView';

export interface Props {
  readonly dispatch : Dispatch<State>;
  readonly currentComponentName : string;
  readonly currentComponentRepo : string;
  readonly tickCount : number;
  readonly tickInterval : number;
  readonly gateCount : number;
  readonly undoCount : number;
  readonly redoCount : number;
  readonly isLoading : boolean;
  readonly isSaving : boolean;
}

export default reax({
  toggleSearch: (event : React.SyntheticEvent<HTMLButtonElement>) => true,
  toggleSimulationMenu: (event : React.SyntheticEvent<HTMLButtonElement>) => true,
  toggleMainMenu: (event : React.SyntheticEvent<HTMLButtonElement>) => true,
  query: (value : string) => value,
  insertPackage: (result : CompiledComponent) => result,
  openComponent: (result : RepoName) => result,
  createComponent: (result : string) => result,
  onUndo: (x : any) => true,
  onRedo: (x : any) => true,
  onSetTickInterval: (value : number) => value,
  onPush: (x : undefined) => true,
  onProfileClick: (x : any) => true
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
  onPush,
  onProfileClick
}, props, initialProps : Props) => {
  insertPackage.subscribe(r => initialProps.dispatch(insertComponentPackage(r)));
  openComponent.subscribe(r => initialProps.dispatch(loadForest(r.repo, r.name, '0')));
  createComponent.subscribe(r => initialProps.dispatch(createForest(r)));
  onUndo.subscribe(() => initialProps.dispatch(undo()));
  onRedo.subscribe(() => initialProps.dispatch(redo()));
  onSetTickInterval.subscribe(x => initialProps.dispatch(setTickInterval(x)));
  onProfileClick.subscribe(() => initialProps.dispatch(showPopup('Profile')));

  const isPushing = onPush.pipe(
    withLatestFrom(props),
    switchMap(([_, props]) => isBusy(storage.push(props.currentComponentName))));

  const showSearch = merge(
      toggleSearch,
      insertPackage.pipe(map(x => true)),
      openComponent.pipe(map(x => true)),
      createComponent.pipe(map(x => true))
    )
    .pipe(
      scan(state => !state, false),
      startWith(false)
    );

  const showSimulationMenu = toggleSimulationMenu.pipe(
    scan(state => !state, false),
    startWith(false)
  );

  const showMainMenu = toggleMainMenu.pipe(
    scan(state => !state, false),
    startWith(false)
  );

  const state = merge(
      showSearch.pipe(map(x => x ? 'search' : '')),
      showSimulationMenu.pipe(map(x => x ? 'simulation' : '')),
      showMainMenu.pipe(map(x => x ? 'main' : ''))
    )
    .pipe(
      scan((_, event) => event, ''),
      share()
    );

  return {
    state,
    showSearch: state.pipe(
      is('search')),
    showSimulationMenu: state.pipe(
      is('simulation')),
    showMainMenu: state.pipe(
      is('main')),
    query: state.pipe(
      is('search'),
      switchMap(ifElse(query.pipe(startWith('')), ''))),
    isPushing
  };
} , ({
  events,
  values,
  props
}) => (
  <div className={style.navbar}>
    <div className={style.bar} data-loading={props.isLoading}>
      <MainMenuButton
        isActive={values.showMainMenu}
        onClick={events.toggleMainMenu}/>
      <SearchBar
        currentComponentName={props.currentComponentName}
        currentComponentRepo={props.currentComponentRepo}
        gateCount={props.gateCount}
        showSearch={values.showSearch}
        toggleSearch={events.toggleSearch}
        isSaving={props.isSaving}
        query={events.query} />
      <SimulationMenuButton
        tick={props.tickCount}
        tickInterval={props.tickInterval}
        onClick={events.toggleSimulationMenu}
        isActive={values.showSimulationMenu} />
    </div>
    <MainMenu
      show={values.state === 'main'}
      push={events.onPush}
      isPushing={values.isPushing}
      showProfile={events.onProfileClick}/>
    { values.state == 'search' &&
    <SearchResults
      query={values.query}
      insertPackage={events.insertPackage}
      openComponent={events.openComponent}
      createComponent={events.createComponent} />}
    <SimulationMenu
      show={values.state == 'simulation'}
      tickInterval={props.tickInterval}
      undoCount={props.undoCount}
      redoCount={props.redoCount}
      setTickInterval={events.onSetTickInterval}
      undo={events.onUndo}
      redo={events.onRedo}/>
  </div>
));

function is<T>(value : T){
  return map(x => x === value);
}

function ifElse<T>(observable : Observable<T>, fallback : T){
  return (condition : boolean) => condition ? observable : of(fallback);
}

function isBusy(p : Promise<any>){
  return merge(
    of(true),
    fromPromise(p.then(x => false, x => (console.error(x), false))));
}