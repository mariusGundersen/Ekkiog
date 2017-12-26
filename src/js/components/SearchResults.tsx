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

import SearchResultView, { NoExactMatchView, SearchResult, RECENT, POPUPLAR, FAVORITE, NORMAL, RepoName } from './SearchResultView';

import style from './search.scss';

import * as storage from '../storage';

export interface Props {
  readonly query : string,
  createComponent(name : string) : void;
  openComponent(component : RepoName) : void;
  insertPackage(component : CompiledComponent) : void;
}

type ObservableProps = Observable<Props>;

export default reax<Props>()(({
  insertPackage: (result : RepoName) => result,
  openComponent: (result : RepoName) => result,
  toggleFavorite: (result : RepoName) => result
}), ({
  insertPackage,
  openComponent,
  toggleFavorite
}, props) => {

  insertPackage
    .withLatestFrom(props)
    .subscribe(([result, props]) => storage.loadPackage(result.repo, result.name, '0').then(props.insertPackage));

  openComponent
    .withLatestFrom(props)
    .subscribe(([result, props]) => props.openComponent(result));

  const updateList = toggleFavorite
    .switchMap(result => Observable.fromPromise(storage.toggleFavorite(result.repo, result.name)))
    .withLatestFrom(props)
    .map(([_, props]) => props.query);

  const searchResults = props
    .map(p => p.query)
    .distinctUntilChanged()
    .merge(updateList)
    .debounceTime(100)
    .switchMap(searchDatabase)
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
        key={`${r.type}_${r.data.repo}_${r.data.name}`}
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
  return Observable.fromPromise(
    storage.searchComponents(query)
    .then(r => r.map(data => ({
      data,
      type: data.favorite ? FAVORITE : NORMAL
    }))));
}

function showEmpty(){
  return Observable.concat(
    getFavorite(),
    getRecent()
  )
  .distinct(t => `${t.data.repo}/${t.data.name}`)
  .scan((acc, val) => [...acc, val], [])
  .debounceTime(10);
}

function getRecent() : Observable<SearchResult>{
  return storage.getRecent()
    .map(data => ({
      data,
      type: RECENT
    }))
    .take(5);
}

function getFavorite() : Observable<SearchResult>{
  return storage.getFavorite()
    .map(data => ({
      data,
      type: FAVORITE
    }));
}
