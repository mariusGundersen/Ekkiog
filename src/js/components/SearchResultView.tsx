import * as React from 'react';

import FaPencil from 'react-icons/fa/pencil';
import MdAddCircleOutline from 'react-icons/fa/plus-circle';
import MdAccessTime from 'react-icons/fa/clock-o';
import MdStar from 'react-icons/fa/star';
import MdFavorite from 'react-icons/fa/heart';
import MdFavoriteBorder from 'react-icons/fa/heart-o';

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
      <button
        className={style.insertPackage}
        onClick={() => insertPackage(result.data)}>
        <span>{result.data.name}</span>
        {result.data.repo && result.data.repo.length && <span className={style.repo}>{result.data.repo}</span>}
      </button>
      <button
        className={style.openComponent}
        onClick={e => openComponent(result.data)}>
        <FaPencil />
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