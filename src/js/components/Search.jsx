import React from 'react';
import {connect} from 'react-redux';

import SearchResults from './SearchResults.jsx';

const Search = connect(
  ({view, global}) => ({
    screenWidth: view.screenWidth,
    screenHeight: view.screenHeight,
    database: global.database
  })
)((props) => {
  const radius = 40;
  const gap = 10;
  const cx = props.screenWidth - radius*2 - gap;
  const cy = gap;

  return (
    <SearchResults radius={radius} gap={gap} cx={cx} cy={cy} database={props.database} />
  );
});

export default Search;