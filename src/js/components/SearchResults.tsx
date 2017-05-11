import * as React from 'react';
import reax from 'reaxjs';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/withLatestFrom';
import { CompiledComponent } from 'ekkiog-editing';

import SearchResultView, { NoExactMatchView } from './SearchResultView';

import style from './search.scss';

import storage, { Storage, NamedForest } from '../storage';

export interface Props {
  query : string,
  createComponent(name : string) : void;
  openComponent(name : NamedForest) : void;
  insertPackage(name : CompiledComponent) : void;
}

type ObservableProps = Observable<Props>;

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
}, ({events, values: {searchResults, noExactMatch}, props}) => (
  <div className={style.searchResultsContainer}>
    <div className={style.searchResults}>
      {noExactMatch && <NoExactMatchView key="no-exact-match" query={props.query} createComponent={props.createComponent} />}
      {searchResults.map(r => <SearchResultView key={r} insertPackage={events.insertPackage} openComponent={events.openComponent} result={r} />)}
    </div>
  </div>
));

function searchDatabase(query : Observable<string>){
  return query
    .debounceTime(20)
    .distinctUntilChanged()
    .switchMap((query) =>
      query
      ? storage.getComponentNames()
        .filter(name => name.toUpperCase().indexOf(query) >= 0)
        .scan((acc, val) => [...acc, val], [])
        .map(list => [...list].sort((a, b) => (a.indexOf(query) - b.indexOf(query)) || (a > b ? 1 : a < b ? -1 : 0)))
        .startWith([])
      : storage.getRecent()
        .take(5)
        .scan((acc, val) => [...acc, val], []))
    .startWith([])
    .distinctUntilChanged()
    .share();
}
