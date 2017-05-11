import * as React from 'react';

import MdEdit from 'react-icons/md/edit';
import MdAddCircle from 'react-icons/md/add-circle';

import style from './search.scss';

export interface SearchResultViewProps {
  insertPackage(result : string) : void;
  openComponent(result : string) : void;
  result : string
}

export default function SearchResultView<T>({insertPackage, openComponent, result} : SearchResultViewProps){
  return (
    <div className={style.searchResult}>
      <button
        className={style.insertPackage}
        onClick={e => insertPackage(result)}>
        {result}
      </button>
      <button
        className={style.openComponent}
        onClick={e => openComponent(result)}>
        <MdEdit />
      </button>
    </div>
  );
}

export interface NoExactMatchViewProps {
  query : string;
  createComponent(name : string) : void;
}

export function NoExactMatchView({query, createComponent} : NoExactMatchViewProps){
  return (
    <div className={style.searchResult}>
      <span className={style.noExactMatch}>
        {query}
      </span>
      <button
        className={style.openComponent}
        onClick={e => createComponent(query)}>
        <MdAddCircle />
      </button>
    </div>
  );
}