import * as React from 'react';
import { connect } from 'react-redux';
import reax from 'reaxjs';
import { Dispatch } from 'redux';
import * as Rx from 'rxjs/Rx.js';
import { CompiledComponent, createForest } from 'ekkiog-editing';

import {
  MdMenu,
  MdSearch,
  MdEdit
} from 'react-icons/lib/md';

import StatusBar from './StatusBar';
import SearchResults from './SearchResults';
import SimulationMenu from './SimulationMenu';

import style from './navbar.scss';

import { insertComponentPackage, setForest } from '../actions';
import { State } from '../reduce';
import { NamedForest } from '../storage';

export interface Props {
  readonly dispatch : Dispatch<State>;
  readonly currentComponentName : string;
  readonly tickCount : number;
  readonly tickInterval : number;
}

const result = reax<Props>()({
  toggleSearch: (event : React.SyntheticEvent<HTMLButtonElement>) => true,
  query: (event : React.SyntheticEvent<HTMLInputElement>) => event.currentTarget.value,
  insertPackage: (result : CompiledComponent) => result,
  openComponent: (result : NamedForest) => result,
  createComponent: (result : string) => result
}, ({
  toggleSearch,
  query,
  insertPackage,
  openComponent,
  createComponent
}, props, initialProps) => ({
  query: query
    .merge(toggleSearch.map(_ => ''))
    .startWith(''),
  showSearch: toggleSearch
    .merge(
      insertPackage.do(r => initialProps.dispatch(insertComponentPackage(r))),
      openComponent.do(r => initialProps.dispatch(setForest(r.name, r))),
      createComponent.do(r => initialProps.dispatch(setForest(r, createForest())))
    )
    .map(x => true)
    .scan((state, _) => !state, false)
    .startWith(false)
}) , ({
  actions,
  results,
  props
}) => (
  <div className={style.navbar}>
    <div className={style.bar}>
      <button className={style.navbarButton}><MdMenu /></button>
      <SearchBar currentComponentName={props.currentComponentName} showSearch={results.showSearch} toggleSearch={actions.toggleSearch} query={actions.query} />
      <SimulationMenu className={style.navbarButton} tick={props.tickCount} tickInterval={props.tickInterval} />
    </div>
    {results.showSearch
    ? <SearchResults
      query={results.query}
      insertPackage={actions.insertPackage}
      openComponent={actions.openComponent}
      createComponent={actions.createComponent} />
    : null}
  </div>
));

export default connect((state : State) => ({
  currentComponentName: state.editor.currentComponentName,
  tickCount: state.simulation.tickCount,
  tickInterval: state.simulation.tickInterval
}))(result);


function SearchBar(props : {
  currentComponentName : string,
  showSearch : boolean,
  toggleSearch : (event : React.SyntheticEvent<HTMLButtonElement>) => void,
  query : (event : React.SyntheticEvent<HTMLInputElement>) => void}) {
  return (
    <div className={style.searchBar} data-state={props.showSearch ? 'search' : 'name'}>
      <div className={style.nameBox}>
        <span>{props.currentComponentName}</span>
      </div>
      <button className={style.navbarButton} onClick={props.toggleSearch}><MdSearch /></button>
      <div className={style.searchBox}>
        {props.showSearch
        ? <input
            autoFocus
            onChange={props.query} />
        : null}
      </div>
    </div>
  );
}