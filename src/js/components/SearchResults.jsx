import React from 'react';
import reax from 'reaxjs';
import Rx from 'rxjs/Rx.js';

import connect from 'reaxjs';
import SearchResultView, {NoExactMatchView} from './SearchResultView.jsx';

import style from './search.css';

export default reax({
  insertPackage: result => result
}, ({
  insertPackage
}, props, initialProps) => {

  insertPackage
    .withLatestFrom(props)
    .subscribe(([name, props]) => props.database.loadPackage(name).then(props.insertPackage));

  const searchResults = searchDatabase(props);

  const noExactMatch = searchResults
    .withLatestFrom(props)
    .map(([results, props]) => props.query && results.indexOf(props.query) === -1);

  return {
    searchResults,
    noExactMatch
  };
}, ({actions, searchResults, noExactMatch, ...props}) => (
  <div className={style.searchResultsContainer}>
    <div className={style.searchResults}>
      {noExactMatch
      ? <NoExactMatchView key="no-exact-match" query={props.query} createComponent={props.createComponent} />
      : null}
      {searchResults.map(r => <SearchResultView key={r} insertPackage={actions.insertPackage} openComponent={props.openComponent} result={r} />)}
    </div>
  </div>
));

function searchDatabase(props){
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
