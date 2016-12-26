import React from 'react';
import {connect} from 'react-redux';

import {
  toggleSearch
} from '../actions.js';

const Search = connect(
  ({view, editor, search}) => ({
    screenWidth: view.screenWidth,
    screenHeight: view.screenHeight,
    search: search
  })
)(({dispatch, ...props}) => {
  const radius = 40;
  const gap = 10;
  const cx = props.screenWidth - radius*2 - gap;
  const cy = gap;

  return (<div>
    {props.search.show ?
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
          autoComplete={true}/>
      </div>
     : null
    }
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
    onClick={() => dispatch(toggleSearch())}>
      🔎
    </button>
  </div>);
});

export default Search;