import * as React from 'react';
import reax from 'reaxjs';
import * as Rx from 'rxjs/Rx';
import { CompiledComponent } from 'ekkiog-editing';

import SearchResultView, { NoExactMatchView } from './SearchResultView';

import style from './search.css';

import storage, { Storage, NamedForest } from '../storage';

export interface Props {
  query : string,
  createComponent(name : string) : void;
  openComponent(name : NamedForest) : void;
  insertPackage(name : CompiledComponent) : void;
}

type ObservableProps = Rx.Observable<Props>;

export default reax<Props>()(({
  insertPackage: (result : string) => result,
  openComponent: (result : string) => result
}), ({
  insertPackage,
  openComponent
}, props) => {

  insertPackage
    .withLatestFrom(props)
    .subscribe(([name, props] : [string, Props]) => storage.loadPackage(name).then(props.insertPackage));

  openComponent
    .withLatestFrom(props)
    .subscribe(([name, props] : [string, Props]) => storage.load(name).then(props.openComponent))

  const searchResults = searchDatabase(props.map(p => p.query));

  const noExactMatch = searchResults
    .withLatestFrom(props)
    .map(([results, props]) => props.query && results.indexOf(props.query) === -1);

  return {
    searchResults,
    noExactMatch
  };
}, ({actions, results: {searchResults, noExactMatch}, props}) => (
  <div className={style.searchResultsContainer}>
    <div className={style.searchResults}>
      {noExactMatch
      ? <NoExactMatchView key="no-exact-match" query={props.query} createComponent={props.createComponent} />
      : null}
      {searchResults.map(r => <SearchResultView key={r} insertPackage={actions.insertPackage} openComponent={actions.openComponent} result={r} />)}
    </div>
  </div>
));

function searchDatabase(query : Rx.Observable<string>){
  return query
    .debounceTime(20)
    .distinctUntilChanged()
    .switchMap((query) =>
      query
      ? storage.getComponentNames()
        .filter(name => name.toLowerCase().indexOf(query.toLowerCase()) >= 0)
        .scan((acc, val) => [...acc, val], [])
        .startWith([])
      : Rx.Observable.of([]))
    .startWith([])
    .distinctUntilChanged();
}
