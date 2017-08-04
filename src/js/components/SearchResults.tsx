import * as React from 'react';
import reax from 'reaxjs';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/do';
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

import SearchResultView, { NoExactMatchView, SearchResult, RECENT, POPUPLAR, FAVORITE, NORMAL } from './SearchResultView';

import style from './search.scss';

import storage from '../storage';

export interface Props {
  query : string,
  createComponent(name : string) : void;
  openComponent(name : string) : void;
  insertPackage(name : CompiledComponent) : void;
}

type ObservableProps = Observable<Props>;

export default reax<Props>()(({
  insertPackage: (result : string) => result,
  openComponent: (result : string) => result,
  toggleFavorite: (result : string) => result
}), ({
  insertPackage,
  openComponent,
  toggleFavorite
}, props) => {

  insertPackage
    .withLatestFrom(props)
    .subscribe(([name, props]) => storage.loadPackage(name).then(props.insertPackage));

  openComponent
    .withLatestFrom(props)
    .subscribe(([name, props]) => props.openComponent(name));

  const updateList = toggleFavorite
    .switchMap(name => Observable.fromPromise(storage.toggleFavorite(name)))
    .withLatestFrom(props)
    .map(([_, props]) => props.query);

  const searchResults = props
    .map(p => p.query)
    .distinctUntilChanged()
    .merge(updateList)
    .debounceTime(100)
    .switchMap(searchDatabase)
    .debounceTime(10)
    .startWith([])
    .share();

  const noExactMatch = searchResults
    .withLatestFrom(props)
    .map(([results, props]) => props.query && results.map(r => r.name).indexOf(props.query) === -1);

  return {
    searchResults,
    noExactMatch
  };
}, ({events, values: {searchResults, noExactMatch}, props}) => (
  <div className={style.searchResultsContainer}>
    <div className={style.searchResults}>
      {noExactMatch && <NoExactMatchView key="no-exact-match" query={props.query} createComponent={props.createComponent} />}
      {searchResults.map(r => <SearchResultView
        key={`${r.name}_${r.type}`}
        result={r}
        insertPackage={events.insertPackage}
        openComponent={events.openComponent}
        toggleFavorite={events.toggleFavorite}/>)}
    </div>
  </div>
));

function searchDatabase(query : string){
  return query.length > 0 ? find(query) : showEmpty()
}

function find(query : string) : Observable<SearchResult[]>{
  return storage.getComponentNames()
    .filter(data => data.name.toUpperCase().indexOf(query) >= 0)
    .map(data => ({name : data.name, type: data.favorite ? FAVORITE : NORMAL}))
    .scan((acc, val) => [...acc, val], [])
    .map(list => [...list].sort((a, b) => (a.name.indexOf(query) - b.name.indexOf(query)) || (a > b ? 1 : a < b ? -1 : 0)))
    .startWith([]);
}

function showEmpty(){
  return Observable.concat(
    getRecent(),
    getFavorite(),
    getPopular()
  )
  .scan((acc, val) => [...acc, val], []);
}

function getRecent() : Observable<SearchResult>{
  return storage.getRecent()
    .map(name => ({name, type: RECENT}))
    .take(5);
}

function getFavorite() : Observable<SearchResult>{
  return storage.getFavorite()
    .map(name => ({name, type: FAVORITE}))
    .take(5);
}

function getPopular() : Observable<SearchResult>{
  return storage.getPopular()
    .map(name => ({name, type: POPUPLAR}))
    .take(5);
}