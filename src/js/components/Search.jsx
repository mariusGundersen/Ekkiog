import React from 'react';
import {connect} from 'react-redux';

import { drawComponent, createForest } from 'ekkiog-editing';

import SearchResults from './SearchResults.jsx';
import {
  insertComponent,
  selectComponent,
  showOkCancelMenu,
  resetMainMenu,
  startSelection,
  stopSelection
} from '../actions.js';

const Search = connect(
  ({view, global, selection}) => ({
    screenWidth: view.screenWidth,
    screenHeight: view.screenHeight,
    centerTile: {
      x: view.centerTile.x|0,
      y: view.centerTile.y|0
    },
    database: global.database,
    selection: selection
  })
)(({screenWidth, centerTile, database, selection, dispatch}) => {
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
        const top = centerTile.y - (result.height>>1);
        const left = centerTile.x - (result.width>>1);
        const right = centerTile.x - (result.width>>1) + result.width;
        const bottom = centerTile.y - (result.height>>1) + result.height;

        dispatch(showOkCancelMenu(
          () => {
            dispatch(stopSelection());
            dispatch(insertComponent(result, centerTile));
            dispatch(resetMainMenu());
          },
          () => {
            dispatch(stopSelection());
            dispatch(resetMainMenu());
          }
        ));
        dispatch(startSelection(top, left, right, bottom));
        dispatch(selectComponent(result, centerTile));
      }} />
  );
});

export default Search;