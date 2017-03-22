import React from 'react';

import {
  MdEdit,
  MdAddCircle
} from 'react-icons/lib/md';

import style from './search.css';

export default function SearchResultView({insertPackage, openComponent, result}){
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

export function NoExactMatchView({query, createComponent}){
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