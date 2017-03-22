import React from 'react';
import {connect} from 'react-redux';
import reax from 'reaxjs';

import Rx from 'rxjs/Rx.js';

import {
  MdMenu,
  MdApps,
  MdSearch,
  MdEdit
} from 'react-icons/lib/md';

import StatusBar from './StatusBar.jsx';
import SearchResults from './SearchResults.jsx';

import style from './navbar.css';

import {insertComponentPackage, loadComponent} from '../actions.js';

export default connect(state => ({
  currentComponentName: state.editor.currentComponentName,
  database: state.global.database
}))(reax({
  toggleSearch: event => true,
  query: event => event.currentTarget.value,
  insertPackage: result => result,
  openComponent: result => result
}, ({
  toggleSearch,
  query,
  insertPackage,
  openComponent
}, props, initialProps) => ({
  query: query
    .merge(toggleSearch.map(_ => ''))
    .startWith(''),
  showSearch: toggleSearch
    .merge(
      insertPackage.do(r => initialProps.dispatch(insertComponentPackage(r))),
      openComponent.do(r => initialProps.dispatch(loadComponent(r)))
    )
    .scan((state, _) => !state, false)
    .startWith(false)
}) , ({
  actions,
  showSearch,
  searchResults,
  query,
  ...props
}) => (
  <div className={style.navbar}>
    <div className={`${style.bar} ${showSearch ? style.searchState : ''}`}>
      <button><MdMenu /></button>
      <div className={style.nameBox}>
        <span>{props.currentComponentName}</span>
      </div>
      <button onClick={actions.toggleSearch}><MdSearch /></button>
      <div className={style.searchBox}>
        {showSearch
        ? <input
            autoFocus
            onChange={actions.query} />
        : null}
      </div>
      <button><MdApps /></button>
    </div>
    {showSearch
    ? <SearchResults
      database={props.database}
      query={query}
      insertPackage={actions.insertPackage}
      openComponent={actions.openComponent}
      createComponent={actions.openComponent} />
    : null}
  </div>
)));
