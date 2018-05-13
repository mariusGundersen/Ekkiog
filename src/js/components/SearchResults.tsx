import * as React from 'react';
import reax from 'reaxjs';
import { Observable, of, concat, from as fromPromise } from 'rxjs';
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
  withLatestFrom,
  combineLatest
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
import { FavoriteComponent, getAllComponents, ComponentMetadata } from '../storage';

export interface Props {
  readonly query : string,
  createComponent(name : string) : void;
  openComponent(component : RepoName) : void;
  insertPackage(component : CompiledComponent) : void;
  isReadOnly : boolean
}

const THE_YEAR_2010 = new Date(2010, 1);

export default reax(({
  insertPackage: (result : RepoName) => result,
  openComponent: (result : RepoName) => result,
  toggleFavorite: (result : RepoName) => result
}), ({
  insertPackage,
  openComponent,
  toggleFavorite
}, props, initialProps : Props) => {
  insertPackage.subscribe(component => storage.loadPackage(component.repo, component.name).then(initialProps.insertPackage));
  openComponent.subscribe(component => initialProps.openComponent(component));

  const updateList = toggleFavorite.pipe(
    switchMap(component => fromPromise(storage.toggleFavorite(component.repo, component.name))),
    switchMap(() => fromPromise(getAllComponents()))
  );

  const allComponents = fromPromise(getAllComponents())
    .pipe(merge(updateList));

  const query = props.pipe(
    map(p => p.query),
    distinctUntilChanged(),
    debounceTime(100)
  );

  const searchResults = query.pipe(
    combineLatest(allComponents),
    map(filterAndSort),
    startWith([] as SearchResult[]),
    share()
  );

  const noExactMatch = searchResults.pipe(
    withLatestFrom(query),
    map(([results, query]) => query && results.map(r => r.data.name).indexOf(query) === -1)
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

function filterAndSort([query, allComponents] : [string, ComponentMetadata[]]){
  console.log(query, query.length);
  return query.length > 0 ? find(query, allComponents) : showEmpty(allComponents)
}

function find(query : string, allComponents : ComponentMetadata[]) : SearchResult[] {
  return allComponents
    .filter(byName(query))
    .sort(bySimilarityTo(query))
    .map(data => ({
      data,
      type: data.favorite ? FAVORITE : NORMAL
    }));
}

function showEmpty(allComponents : ComponentMetadata[]){
  return allComponents
    .sort(byType)
    .map(toType);
}

function byName(query : string){
  return (data : {name : string}) => data.name.toUpperCase().indexOf(query) >= 0;
}

function bySimilarityTo(query : string){
  return (a : ComponentMetadata, b : ComponentMetadata) => (
    (a.repo > b.repo ? 1 : a.repo < b.repo ? -1 : 0)
    || (a.name.indexOf(query) - b.name.indexOf(query))
    || (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
}

function byType(a : ComponentMetadata, b : ComponentMetadata){
  if(a.favorite){
    return (!b.favorite ? -1 : 0)
    || (a.name > b.name ? 1 : a.name < b.name ? -1 : 0);
  }else{
    return (b.favorite ? 1 : 0)
    || (a.usedAt < b.usedAt ? 1 : a.usedAt > b.usedAt ? -1 : 0)
    || (a.repo > b.repo ? 1 : a.repo < b.repo ? -1 : 0)
    || (a.name > b.name ? 1 : a.name < b.name ? -1 : 0);
  }
}

function toType(data : ComponentMetadata){
  if(data.favorite){
    return typed(FAVORITE, data);
  }else if(data.usedAt > THE_YEAR_2010){
    return typed(RECENT, data);
  }else{
    return typed(NORMAL, data);
  }
}

function typed<T extends typeof RECENT | typeof FAVORITE | typeof NORMAL>(type : T, data : RepoName) {
  return {
    data,
    type
  };
}
