import React from 'react';

import style from './search.css';

export default function({
  show,
  onToggle,
  onChange,
  searchResults,
  cx,
  cy,
  radius,
  gap
}){
  return (
    <div>
    {show ?
    <div
      className={style.search}
      style={{
        top: cy + radius/2 -2,
        left: gap,
        right: radius*2 + gap*2,
        width: cx - gap*2,
        height: radius,
      }}>
      <input
        className={style.input}
        style={{
          fontSize: radius-5
        }}
        onChange={onChange}
        autoComplete={true}/>
        {searchResults.length > 0 ?
          <div className={style.results}>
            {searchResults.map((result, index) => (
              <div
                className={style.result}
                key={index}>
                {result}
              </div>
            ))}
          </div>
          : null }
    </div>
    : null}
    <button
      className={style.searchButton}
      style={{
        top: cy,
        left: cx,
        borderRadius: radius,
        width: radius*2,
        height: radius*2,
        fontSize: radius
      }}
      onClick={onToggle}>
      🔎
    </button>
  </div>
  );
}