import * as React from 'react';

import MdEdit from 'react-icons/md/edit';
import MdAddCircleOutline from 'react-icons/md/add-circle-outline';
import MdAccessTime from 'react-icons/md/access-time';
import MdStar from 'react-icons/md/star';
import MdFavorite from 'react-icons/md/favorite';
import MdFavoriteBorder from 'react-icons/md/favorite-border';

import style from './search.scss';
import { Switch, Route } from 'react-router-dom';

export const RECENT : 'recent' = 'recent';
export const POPUPLAR : 'popular' = 'popular';
export const FAVORITE : 'favorite' = 'favorite';
export const NORMAL : 'normal' = 'normal';

export interface SearchResult {
  readonly data : RepoNameVersion
  readonly type : 'recent' | 'popular' | 'favorite' | 'normal'
}

export interface RepoNameVersion {
  readonly repo : string
  readonly name : string
  readonly version : string

}

export interface SearchResultViewProps {
  insertPackage(result : RepoNameVersion) : void;
  openComponent(result : RepoNameVersion) : void;
  toggleFavorite(result : RepoNameVersion) : void;
  readonly result : SearchResult;
}

export default function SearchResultView<T>({insertPackage, openComponent, toggleFavorite, result} : SearchResultViewProps){
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
            {result.data.name}
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