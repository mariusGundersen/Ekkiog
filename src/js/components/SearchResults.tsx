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

import SearchResultView, { NoExactMatchView, SearchResult, RepoNameVersion, RECENT, POPUPLAR, FAVORITE, NORMAL } from './SearchResultView';

import style from './search.scss';

import * as storage from '../storage';

export { RepoNameVersion };

export interface Props {
  readonly query : string,
  createComponent(name : string) : void;
  openComponent(component : RepoNameVersion) : void;
  insertPackage(component : CompiledComponent) : void;
}

type ObservableProps = Observable<Props>;

export default reax<Props>()(({
  insertPackage: (result : RepoNameVersion) => result,
  openComponent: (result : RepoNameVersion) => result,
  toggleFavorite: (result : RepoNameVersion) => result
}), ({
  insertPackage,
  openComponent,
  toggleFavorite
}, props) => {

  insertPackage
    .withLatestFrom(props)
    .subscribe(([result, props]) => storage.loadPackage(result.repo, result.name, result.version).then(props.insertPackage));

  openComponent
    .withLatestFrom(props)
    .subscribe(([result, props]) => props.openComponent(result));

  const updateList = toggleFavorite
    .switchMap(result => Observable.fromPromise(storage.toggleFavorite(result.name)))
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
    .map(([results, props]) => props.query && results.map(r => r.data.name).indexOf(props.query) === -1);

  return {
    searchResults,
    noExactMatch
  };
}, ({events, values: {searchResults, noExactMatch}, props}) => (
  <div className={style.searchResultsContainer}>
    <div className={style.searchResults}>
      {noExactMatch && <NoExactMatchView key="no-exact-match" query={props.query} createComponent={props.createComponent} />}
      {searchResults.map(r => <SearchResultView
        key={`${r.data.name}_${r.type}`}
        result={r}
        insertPackage={events.insertPackage}
        openComponent={events.openComponent}
        toggleFavorite={events.toggleFavorite} />)}
    </div>
  </div>
));

function searchDatabase(query : string){
  return query.length > 0 ? find(query) : showEmpty()
}

function find(query : string) : Observable<SearchResult[]>{
  return storage.getComponentNames()
    .filter(data => data.name.toUpperCase().indexOf(query) >= 0)
    .map(data => ({
      data: {
        repo: '',
        name: data.name,
        version: '0',
      },
      type: data.favorite ? FAVORITE : NORMAL
    }))
    .scan((acc, val) => [...acc, val], [])
    .map(list => [...list].sort(bySimilarityTo(query)))
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
    .map(name => ({
      data: {
        repo: '',
        name,
        version: '0'
      },
      type: RECENT
    }))
    .take(5);
}

function getFavorite() : Observable<SearchResult>{
  return storage.getFavorite()
    .map(name => ({
      data: {
        repo: '',
        name,
        version: '0'
      },
      type: FAVORITE
    }))
    .take(5);
}

function getPopular() : Observable<SearchResult>{
  return storage.getPopular()
    .map(name => ({
      data: {
        repo: '',
        name,
        version: '0'
      },
      type: POPUPLAR
    }))
    .take(5);
}

function bySimilarityTo(query : string){
  return (a : SearchResult, b : SearchResult) => (a.data.name.indexOf(query) - b.data.name.indexOf(query)) || (a > b ? 1 : a < b ? -1 : 0)
}