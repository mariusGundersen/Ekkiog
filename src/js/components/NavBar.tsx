import * as React from 'react';
import { connect } from 'react-redux';
import reax from 'reaxjs';
import { Dispatch } from 'redux';
import * as Rx from 'rxjs/Rx.js';
import { CompiledComponent, createForest } from 'ekkiog-editing';

import {
  MdMenu,
  MdApps,
  MdSearch,
  MdEdit
} from 'react-icons/lib/md';

import StatusBar from './StatusBar';
import SearchResults from './SearchResults';

import style from './navbar.css';

import { insertComponentPackage, setForest } from '../actions';

import { Storage, NamedForest } from '../storage/database';

export interface Props {
  dispatch : Dispatch<any>;
  currentComponentName : string;
  database : Storage
}

const result = reax<Props>()({
  toggleSearch: (event : React.SyntheticEvent<any>) => true,
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
    .scan((state, _) => !state, false)
    .startWith(false)
}) , ({
  actions,
  results,
  props
}) => (
  <div className={style.navbar}>
    <div className={`${style.bar} ${results.showSearch ? style.searchState : ''}`}>
      <button><MdMenu /></button>
      <div className={style.nameBox}>
        <span>{props.currentComponentName}</span>
      </div>
      <button onClick={actions.toggleSearch}><MdSearch /></button>
      <div className={style.searchBox}>
        {results.showSearch
        ? <input
            autoFocus
            onChange={actions.query} />
        : null}
      </div>
      <button><MdApps /></button>
    </div>
    {results.showSearch
    ? <SearchResults
      database={props.database}
      query={results.query}
      insertPackage={actions.insertPackage}
      openComponent={actions.openComponent}
      createComponent={actions.createComponent} />
    : null}
  </div>
));

export default connect(state => ({
  currentComponentName: state.editor.currentComponentName,
  database: state.global.database
}))(result);
