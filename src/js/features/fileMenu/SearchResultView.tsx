import * as React from 'react';

import EditComponentIcon from 'react-icons/fa/edit';
import InsertComponentIcon from 'react-icons/fa/plus-square';
import NewComponentIcon from 'react-icons/fa/certificate';
import CreateComponentIcon from 'react-icons/fa/plus-circle';
import RecentComponentIcon from 'react-icons/fa/clock-o';
import MdFavorite from 'react-icons/fa/heart';
import MdFavoriteBorder from 'react-icons/fa/heart-o';

import style from './search.scss';

export const RECENT: 'recent' = 'recent';
export const FAVORITE: 'favorite' = 'favorite';
export const NORMAL: 'normal' = 'normal';

export interface SearchResult {
  readonly data: RepoName
  readonly type: 'recent' | 'favorite' | 'normal'
}

export interface RepoName {
  readonly repo: string
  readonly name: string
}

export interface SearchResultViewProps {
  insertPackage(result: RepoName): void;
  openComponent(result: RepoName): void;
  toggleFavorite(result: RepoName): void;
  readonly result: SearchResult;
  readonly canInsert: boolean;
}

export default function SearchResultView({ insertPackage, openComponent, toggleFavorite, result, canInsert }: SearchResultViewProps) {
  return (
    <div className={style.searchResult}>
      <button
        className={style.toggleFavorite}
        onClick={e => toggleFavorite(result.data)}>
        {getIcon(result)}
      </button>
      <button
        className={style.componentName}
        onClick={() => canInsert ? insertPackage(result.data) : openComponent(result.data)}>
        <span>{result.data.name}</span>
        {result.data.repo && result.data.repo.length && <span className={style.repo}>{result.data.repo}</span>}
      </button>
      {canInsert &&
        <button
          className={style.insertComponent}
          onClick={() => insertPackage(result.data)}>
          <InsertComponentIcon />
        </button>
      }
      <button
        className={style.openComponent}
        onClick={e => openComponent(result.data)}>
        <EditComponentIcon />
      </button>
    </div>
  );
}

function getIcon(result: SearchResult) {
  switch (result.type) {
    case 'recent':
      return <RecentComponentIcon />
    case 'favorite':
      return <MdFavorite />
    case 'normal':
      return <MdFavoriteBorder />
  }
}

export interface NoExactMatchViewProps {
  readonly query: string;
  createComponent(name: string): void;
}

export function NoExactMatchView({ query, createComponent }: NoExactMatchViewProps) {
  return (
    <div className={style.searchResult}>
      <button
        className={style.toggleFavorite}
        onClick={e => createComponent(query)}>
        <NewComponentIcon />
      </button>
      <button
        className={style.noExactMatch}
        onClick={e => createComponent(query)}>
        {query}
      </button>
      <button
        className={style.openComponent}
        onClick={e => createComponent(query)}>
        <CreateComponentIcon />
      </button>
    </div>
  );
}
