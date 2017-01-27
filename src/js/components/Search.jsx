import React from 'react';
import {connect} from 'react-redux';

import SearchResults from './SearchResults.jsx';
import {
  insertComponent,
  selectComponent,
  showOkCancelMenu,
  resetMainMenu,
  startSelection,
  stopSelection
} from '../actions.js';
import drawComponent from '../editing/actions/drawComponent.js';
import createForest from '../editing/actions/createForest.js';

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
        const top = (centerTile.y|0) - (result.source.height>>1);
        const left = (centerTile.x|0) - (result.source.width>>1);
        const right = (centerTile.x|0) - (result.source.width>>1) + result.source.width;
        const bottom = (centerTile.y|0) - (result.source.height>>1) + result.source.height;
        dispatch(startSelection(top, left, right, bottom));
        dispatch(selectComponent(result, centerTile));
        dispatch(showOkCancelMenu(
          () => {
            dispatch(insertComponent(result, centerTile));
            dispatch(resetMainMenu());
            dispatch(stopSelection());
          },
          () => {
            dispatch(resetMainMenu());
            dispatch(stopSelection());
          }
        ));
      }} />
  );
});

export default Search;