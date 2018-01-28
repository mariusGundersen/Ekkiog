import * as React from 'react';
import reax from 'reaxjs';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { concat } from 'rxjs/observable/concat';
import { fromPromise } from 'rxjs/observable/fromPromise';
import {
  debounceTime,
  distinct,
  distinctUntilChanged,
  map,
  merge,
  scan,
  share,
  startWith,
  switchMap,
  take,
  withLatestFrom
} from 'rxjs/operators';
import { CompiledComponent } from 'ekkiog-editing';

import SearchResultView,
{
  NoExactMatchView,
  SearchResult,
  RECENT,
  FAVORITE,
  NORMAL,
  RepoName
} from './SearchResultView';

import style from './search.scss';

import * as storage from '../storage';
import { FavoriteComponent } from '../storage';

export interface Props {
  readonly query : string,
  createComponent(name : string) : void;
  openComponent(component : RepoName) : void;
  insertPackage(component : CompiledComponent) : void;
  isReadOnly : boolean
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
  insertPackage.pipe(
    withLatestFrom(props)
  ).subscribe(([result, props]) => storage.loadPackage(result.repo, result.name).then(props.insertPackage));

  openComponent.pipe(
    withLatestFrom(props)
  ).subscribe(([result, props]) => props.openComponent(result));

  const updateList = toggleFavorite.pipe(
    switchMap(result => fromPromise(storage.toggleFavorite(result.repo, result.name))),
    withLatestFrom(props),
    map(([_, props]) => props.query));

  const searchResults = props.pipe(
    map(p => p.query),
    distinctUntilChanged(),
    merge(updateList),
    debounceTime(100),
    switchMap(searchDatabase),
    startWith([] as SearchResult[]),
    share()
  );

  const noExactMatch = searchResults.pipe(
    withLatestFrom(props),
    map(([results, props]) => props.query && results.map(r => r.data.name).indexOf(props.query) === -1)
  );

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
        canInsert={!props.isReadOnly}
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
  return fromPromise(
    storage.searchComponents(query)
    .then(r => r.map(data => ({
      data,
      type: data.favorite ? FAVORITE : NORMAL
    }))));
}

function showEmpty(){
  return concat(
    getFavorite(),
    getRecent()
  ).pipe(
    distinct(t => `${t.data.repo}/${t.data.name}`),
    scan<SearchResult>((acc, val) => [...acc, val], []),
    debounceTime(10)
  );
}

function getRecent() {
  return storage.getRecent().pipe(
    map(typed(RECENT)),
    take(20));
}

function getFavorite() {
  return storage.getFavorite().pipe(
    map(typed(FAVORITE))
  );
}

function typed<T extends typeof RECENT | typeof FAVORITE>(type : T) : (data : RepoName) => SearchResult {
  return (data : RepoName) => ({
    data,
    type
  });
}
