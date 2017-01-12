import React from 'react';

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
    <div style={{
      position: 'absolute',
      top: cy + radius/2 -2,
      left: gap,
      right: radius*2 + gap*2,
      width: cx - gap*2,
      height: radius,
      background: '#2a2d30',
      border: '2px solid #446364',
      display: 'flex'
    }}>
      <input
        style={{
          background: 'transparent',
          border: 'none',
          color: 'white',
          flex: '1 0 100%',
          width: '100%',
          fontSize: radius-5
        }}
        onChange={onChange}
        autoComplete={true}/>
        <div>
          {searchResults.map((result, index) => (<div key={index}>{result}</div>))}
        </div>
    </div>
    : null}
    <button style={{
      position: 'absolute',
      top: cy,
      left: cx,
      borderRadius: radius,
      width: radius*2,
      height: radius*2,
      background: '#2a2d30',
      border: '2px solid #446364',
      color: 'white',
      fontSize: radius
    }}
    onClick={onToggle}>
      🔎
    </button>
  </div>
  );
}