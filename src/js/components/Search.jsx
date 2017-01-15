import React from 'react';
import {connect} from 'react-redux';

import SearchResults from './SearchResults.jsx';

const Search = connect(
  ({view, global}) => ({
    screenWidth: view.screenWidth,
    screenHeight: view.screenHeight,
    database: global.database
  })
)(({screenWidth, database, dispatch}) => {
  const radius = 40;
  const gap = 10;
  const cx = screenWidth - radius*2 - gap;
  const cy = gap;

  return (
    <SearchResults
      radius={radius}
      gap={gap}
      cx={cx}
      cy={cy}
      database={database}
      onSelect={() => dispatch({type:'bleh'})} />
  );
});

export default Search;