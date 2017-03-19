import React from 'react';
import reax from 'reaxjs';
import Rx from 'rxjs/Rx.js';

import connect from 'reaxjs';
import SearchResultView from './SearchResultView.jsx';

import style from './search.css';

export default reax({
  insertPackage: result => result,
  openComponent: result => result
}, ({
  insertPackage,
  openComponent
}, props, initialProps) => {

  insertPackage
    .withLatestFrom(props)
    .subscribe(([name, props]) => props.database.loadPackage(name).then(props.insertPackage));

  openComponent
    .withLatestFrom(props)
    .subscribe(([name, props]) => props.openComponent(name));

  return {
    searchResults: searchResults(props)
  };
}, ({actions, searchResults, }) => (
  <div className={style.searchResults}>
    {searchResults.map(r => <SearchResultView key={r} insertPackage={actions.insertPackage} openComponent={actions.openComponent} result={r} />)}
  </div>
));

function searchResults(props){
  return props
    .switchMap(({database, query}) =>
      query
      ? database.getComponentNames()
        .filter(name => name.toLowerCase().indexOf(query.toLowerCase()) >= 0)
        .scan((acc, val) => [...acc, val], [])
        .startWith([])
      : Rx.Observable.of([]))
    .startWith([])
    .distinctUntilChanged();
}
