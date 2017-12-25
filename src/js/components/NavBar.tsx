import * as React from 'react';
import reax from 'reaxjs';
import { Dispatch } from 'redux';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';
import { CompiledComponent } from 'ekkiog-editing';

import MainMenuButton from './MainMenuButton';
import SearchResults, { RepoNameVersion } from './SearchResults';
import SimulationMenuButton from './SimulationMenuButton';
import SimulationMenu from './SimulationMenu';
import MainMenu from './MainMenu';
import SearchBar from './SearchBar';

import style from './navbar.scss';

import { insertComponentPackage, loadForest, setTickInterval, undo, redo, createForest } from '../actions';
import { State } from '../reduce';
import * as storage from '../storage';

export interface Props {
  readonly dispatch : Dispatch<State>;
  readonly currentComponentName : string;
  readonly tickCount : number;
  readonly tickInterval : number;
  readonly gateCount : number;
  readonly undoCount : number;
  readonly redoCount : number;
  readonly isLoading : boolean;
}

export default reax({
  toggleSearch: (event : React.SyntheticEvent<HTMLButtonElement>) => true,
  toggleSimulationMenu: (event : React.SyntheticEvent<HTMLButtonElement>) => true,
  toggleMainMenu: (event : React.SyntheticEvent<HTMLButtonElement>) => true,
  query: (value : string) => value,
  insertPackage: (result : CompiledComponent) => result,
  openComponent: (result : RepoNameVersion) => result,
  createComponent: (result : string) => result,
  onUndo: (x : any) => true,
  onRedo: (x : any) => true,
  onSetTickInterval: (value : number) => value,
  onPush: (X : undefined) => true
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
  onPush
}, props, initialProps : Props) => {
  insertPackage.forEach(r => initialProps.dispatch(insertComponentPackage(r)));
  openComponent.forEach(r => initialProps.dispatch(loadForest(r.repo, r.name, r.version)));
  createComponent.forEach(r => initialProps.dispatch(createForest(r)));
  onUndo.forEach(() => initialProps.dispatch(undo()));
  onRedo.forEach(() => initialProps.dispatch(redo()));
  onSetTickInterval.forEach(x => initialProps.dispatch(setTickInterval(x)));

  const isPushing = onPush
    .withLatestFrom(props)
    .switchMap(([_, props]) => isBusy(storage.push("ekkiog-workspace", props.currentComponentName)));

  const showSearch = toggleSearch
    .merge(
      insertPackage.map(x => true),
      openComponent.map(x => true),
      createComponent.map(x => true)
    )
    .scan(state => !state, false)
    .startWith(false);

  const showSimulationMenu = toggleSimulationMenu
    .scan(state => !state, false)
    .startWith(false);

  const showMainMenu = toggleMainMenu
    .scan(state => !state, false)
    .startWith(false);

  const state = Observable.merge(
    showSearch.map(x => x ? 'search' : ''),
    showSimulationMenu.map(x => x ? 'simulation' : ''),
    showMainMenu.map(x => x ? 'main' : '')
  ).scan((_, event) => event, '')
  .share();

  return {
    state,
    showSearch: state.map(x => x == 'search'),
    showSimulationMenu: state.map(x => x == 'simulation'),
    showMainMenu: state.map(x => x == 'main'),
    query: state.map(x => x == 'search')
      .switchMap(ifElse(query.startWith(''), '')),
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
        gateCount={props.gateCount}
        showSearch={values.showSearch}
        toggleSearch={events.toggleSearch}
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
      isPushing={values.isPushing}/>
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

export function ifElse<T>(observable : Observable<T>, fallback : T){
  return (condition : boolean) => condition ? observable : Observable.of(fallback);
}

function isBusy(p : Promise<any>){
  return Observable.merge(
    Observable.of(true),
    Observable.fromPromise(p.then(x => false, x => (console.error(x), false))));
}