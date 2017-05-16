import * as React from 'react';
import { connect } from 'react-redux';
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
import { CompiledComponent, createForest } from 'ekkiog-editing';

import MainMenuButton from './MainMenuButton';
import SearchResults from './SearchResults';
import SimulationMenuButton from './SimulationMenuButton';
import SimulationMenu from './SimulationMenu';
import SearchBar from './SearchBar';

import style from './navbar.scss';

import { insertComponentPackage, setForest, setTickInterval } from '../actions';
import { State } from '../reduce';
import { NamedForest } from '../storage';

export interface Props {
  readonly dispatch : Dispatch<State>;
  readonly currentComponentName : string;
  readonly tickCount : number;
  readonly tickInterval : number;
  readonly gateCount : number;
}

const result = reax({
  toggleSearch: (event : React.SyntheticEvent<HTMLButtonElement>) => true,
  toggleSimulationMenu: (event : React.SyntheticEvent<HTMLButtonElement>) => true,
  query: (value : string) => value,
  insertPackage: (result : CompiledComponent) => result,
  openComponent: (result : NamedForest) => result,
  createComponent: (result : string) => result
}, ({
  toggleSearch,
  toggleSimulationMenu,
  query,
  insertPackage,
  openComponent,
  createComponent
}, props, initialProps : Props) => {
  insertPackage.forEach(r => initialProps.dispatch(insertComponentPackage(r)));
  openComponent.forEach(r => initialProps.dispatch(setForest(r.name, r)));
  createComponent.forEach(r => initialProps.dispatch(setForest(r, createForest())))

  const showSearch = toggleSearch
    .merge(
      insertPackage.map(x => true),
      openComponent.map(x => true),
      createComponent.map(x => true)
    )
    .scan((state, _) => !state, false)
    .startWith(false);

  const showSimulationMenu = toggleSimulationMenu
    .scan(state => !state, false)
    .startWith(false);

  const state = Observable.merge(
    showSearch.map(x => x ? 'search' : ''),
    showSimulationMenu.map(x => x ? 'simulation' : '')
  ).scan((_, event) => event, '');

  return {
    showSearch: state.map(x => x == 'search'),
    showSimulationMenu: state.map(x => x == 'simulation'),
    query: state.map(x => x == 'search')
      .switchMap(ifElse(query.startWith(''), ''))
  };
} , ({
  events,
  values,
  props
}) => (
  <div className={style.navbar}>
    <div className={style.bar}>
      <MainMenuButton />
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
    {values.showSearch
    ? <SearchResults
      query={values.query}
      insertPackage={events.insertPackage}
      openComponent={events.openComponent}
      createComponent={events.createComponent} />
    : values.showSimulationMenu
    ? <SimulationMenu
      tickInterval={props.tickInterval}
      setTickInterval={x => props.dispatch(setTickInterval(x))}/>
    : null}
  </div>
));

export default connect((state : State) => ({
  currentComponentName: state.editor.currentComponentName,
  tickCount: state.simulation.tickCount,
  tickInterval: state.simulation.tickInterval,
  gateCount: (state.forest.buddyTree.usedSize||2) - 2
}))(result);

export function ifElse<T>(observable : Observable<T>, fallback : T){
  return (condition : boolean) => condition ? observable : Observable.of(fallback);
}