import * as React from 'react';
import reax from 'reaxjs';
import { from as fromPromise } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  share,
  startWith,
  switchMap,
  combineLatest,
  filter
} from 'rxjs/operators';
import { Package } from '../../editing';

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

import * as storage from '../../storage';
import { getAllComponents, ComponentMetadata } from '../../storage';
import classes from '../../components/classes';

export interface Props {
  readonly query: string,
  createComponent(name: string): void;
  openComponent(component: RepoName): void;
  insertPackage(component: Package): void;
  isReadOnly: boolean
}

const THE_YEAR_2010 = new Date(2010, 1);

export default reax(
  {
    insertPackage: (result: RepoName) => result,
    openComponent: (result: RepoName) => result,
    toggleFavorite: (result: RepoName) => result
  }, ({
    insertPackage,
    openComponent,
    toggleFavorite
  }, props, initialProps: Props) => {
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
      combineLatest(query),
      map(([results, query]) => query.length > 0 && results.map(r => r.data.name).indexOf(query) === -1)
    );

    const favoriteResults = searchResults.pipe(
      map(r => r.filter(r => r.type === 'favorite')),
      startWith([] as SearchResult[]),
    );

    const recentResults = searchResults.pipe(
      map(r => r.filter(r => r.type === 'recent')),
      startWith([] as SearchResult[]),
    );

    const otherResults = searchResults.pipe(
      map(r => r.filter(r => r.type === 'normal')),
      startWith([] as SearchResult[]),
    );

    return {
      query,
      favoriteResults,
      recentResults,
      otherResults,
      noExactMatch
    };
  }, ({ favoriteResults, recentResults, otherResults, noExactMatch, query }, events, props) => (
    <div className={style.searchResults}>
      {noExactMatch && <NoExactMatchView key="no-exact-match" query={query} createComponent={props.createComponent} />}
      {favoriteResults.length > 0 && <div key="favorites-separator" className={classes(style.searchResult, style.searchSeparator)}>
        Favorite components
        </div>}
      {favoriteResults.map(r => <SearchResultView
        key={`${r.type}_${r.data.repo}_${r.data.name}`}
        result={r}
        canInsert={!props.isReadOnly}
        insertPackage={events.insertPackage}
        openComponent={events.openComponent}
        toggleFavorite={events.toggleFavorite} />)}
      {recentResults.length > 0 && <div key="recent-separator" className={classes(style.searchResult, style.searchSeparator)}>
        Recent components
        </div>}
      {recentResults.map(r => <SearchResultView
        key={`${r.type}_${r.data.repo}_${r.data.name}`}
        result={r}
        canInsert={!props.isReadOnly}
        insertPackage={events.insertPackage}
        openComponent={events.openComponent}
        toggleFavorite={events.toggleFavorite} />)}
      {otherResults.length > 0 && <div key="other-separator" className={classes(style.searchResult, style.searchSeparator)}>
        {favoriteResults.length + recentResults.length > 0 ? 'Other' : ''} Components
        </div>}
      {otherResults.map(r => <SearchResultView
        key={`${r.type}_${r.data.repo}_${r.data.name}`}
        result={r}
        canInsert={!props.isReadOnly}
        insertPackage={events.insertPackage}
        openComponent={events.openComponent}
        toggleFavorite={events.toggleFavorite} />)}
    </div>
  ));

function filterAndSort([query, allComponents]: [string, ComponentMetadata[]]) {
  return query.length > 0 ? find(query, allComponents) : showEmpty(allComponents)
}

function find(query: string, allComponents: ComponentMetadata[]): SearchResult[] {
  return allComponents
    .filter(byName(query))
    .sort(bySimilarityTo(query))
    .map(data => ({
      data,
      type: data.favorite ? FAVORITE : NORMAL
    }));
}

function showEmpty(allComponents: ComponentMetadata[]) {
  return allComponents
    .sort(byType)
    .map(toType);
}

function byName(query: string) {
  return (data: { name: string }) => data.name.toUpperCase().indexOf(query) >= 0;
}

function bySimilarityTo(query: string) {
  return (a: ComponentMetadata, b: ComponentMetadata) => (
    (a.repo > b.repo ? 1 : a.repo < b.repo ? -1 : 0)
    || (a.name.indexOf(query) - b.name.indexOf(query))
    || (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
}

function byType(a: ComponentMetadata, b: ComponentMetadata) {
  if (a.favorite) {
    return (!b.favorite ? -1 : 0)
      || (a.name > b.name ? 1 : a.name < b.name ? -1 : 0);
  } else {
    return (b.favorite ? 1 : 0)
      || (a.usedAt < b.usedAt ? 1 : a.usedAt > b.usedAt ? -1 : 0)
      || (a.repo > b.repo ? 1 : a.repo < b.repo ? -1 : 0)
      || (a.name > b.name ? 1 : a.name < b.name ? -1 : 0);
  }
}

function toType(data: ComponentMetadata) {
  if (data.favorite) {
    return typed(FAVORITE, data);
  } else if (data.usedAt > THE_YEAR_2010) {
    return typed(RECENT, data);
  } else {
    return typed(NORMAL, data);
  }
}

function typed<T extends typeof RECENT | typeof FAVORITE | typeof NORMAL>(type: T, data: RepoName) {
  return {
    data,
    type
  };
}
