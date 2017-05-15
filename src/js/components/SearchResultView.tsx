import * as React from 'react';

import MdEdit from 'react-icons/md/edit';
import MdAddCircleOutline from 'react-icons/md/add-circle-outline';
import MdAccessTime from 'react-icons/md/access-time';
import MdStar from 'react-icons/md/star';
import MdFavorite from 'react-icons/md/favorite';
import MdFavoriteBorder from 'react-icons/md/favorite-border';

import style from './search.scss';

export interface SearchResult {
  readonly name : string;
  readonly type : 'recent' | 'popular' | 'favorite' | 'normal'
}

export interface SearchResultViewProps {
  insertPackage(result : string) : void;
  openComponent(result : string) : void;
  toggleFavorite(result : string) : void;
  readonly result : SearchResult;
}

export default function SearchResultView<T>({insertPackage, openComponent, toggleFavorite, result} : SearchResultViewProps){
  return (
    <div className={style.searchResult}>
      <button
        className={style.toggleFavorite}
        onClick={e => toggleFavorite(result.name)}>
        {getIcon(result)}
      </button>
      <button
        className={style.insertPackage}
        onClick={e => insertPackage(result.name)}>
        {result.name}
      </button>
      <button
        className={style.openComponent}
        onClick={e => openComponent(result.name)}>
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