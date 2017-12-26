import * as React from 'react';

import MdEdit from 'react-icons/md/edit';
import MdAddCircleOutline from 'react-icons/md/add-circle-outline';
import MdAccessTime from 'react-icons/md/access-time';
import MdStar from 'react-icons/md/star';
import MdFavorite from 'react-icons/md/favorite';
import MdFavoriteBorder from 'react-icons/md/favorite-border';

import style from './search.scss';
import { Switch, Route } from 'react-router-dom';
import { ComponentMetadata } from '../storage/index';

export const RECENT : 'recent' = 'recent';
export const POPUPLAR : 'popular' = 'popular';
export const FAVORITE : 'favorite' = 'favorite';
export const NORMAL : 'normal' = 'normal';

export interface SearchResult {
  readonly data : RepoName
  readonly type : 'recent' | 'popular' | 'favorite' | 'normal'
}

export interface RepoName {
  readonly repo : string
  readonly name : string
}

export interface SearchResultViewProps {
  insertPackage(result : RepoName) : void;
  openComponent(result : RepoName) : void;
  toggleFavorite(result : RepoName) : void;
  readonly result : SearchResult;
}

export default function SearchResultView({insertPackage, openComponent, toggleFavorite, result} : SearchResultViewProps){
  return (
    <div className={style.searchResult}>
      <button
        className={style.toggleFavorite}
        onClick={e => toggleFavorite(result.data)}>
        {getIcon(result)}
      </button>
        <Route path="/demo" children={props =>
          <button
            className={style.insertPackage}
            onClick={() => props.match ? openComponent(result.data) : insertPackage(result.data)}>
            <span>{result.data.name}</span>
            {result.data.repo && result.data.repo.length && <span className={style.repo}>{result.data.repo}</span>}
          </button>
        } />
      <button
        className={style.openComponent}
        onClick={e => openComponent(result.data)}>
        <MdEdit />
      </button>
    </div>
  );
}

function getIcon(result : SearchResult){
  switch(result.type){
    case 'recent':
      return <MdAccessTime />
    case 'popular':
      return <MdStar />
    case 'favorite':
      return <MdFavorite />
    case 'normal':
      return <MdFavoriteBorder />
  }
}

export interface NoExactMatchViewProps {
  readonly query : string;
  createComponent(name : string) : void;
}

export function NoExactMatchView({query, createComponent} : NoExactMatchViewProps){
  return (
    <div className={style.searchResult}>
      <button
        className={style.openComponent}
        onClick={e => createComponent(query)}>
        <MdAddCircleOutline />
      </button>
      <button
        className={style.noExactMatch}
        onClick={e => createComponent(query)}>
        {query}
      </button>
    </div>
  );
}