import React from 'react';
import {connect} from 'react-redux';

import SearchResults from './SearchResults.jsx';
import {
  insertComponent,
  showOkCancelMenu,
  resetMainMenu
} from '../actions.js';

const Search = connect(
  ({view, global}) => ({
    screenWidth: view.screenWidth,
    screenHeight: view.screenHeight,
    centerTile: view.centerTile,
    database: global.database
  })
)(({screenWidth, centerTile, database, dispatch}) => {
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
      onSelect={result => {
        dispatch(showOkCancelMenu(
          () => {
            dispatch(insertComponent(result, centerTile));
            dispatch(resetMainMenu());
          },
          () => dispatch(resetMainMenu())
        ));
      }} />
  );
});

export default Search;