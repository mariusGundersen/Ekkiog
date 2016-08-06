import React from 'react';
import {connect} from 'react-redux';

import {
  SET_SELECTED_TOOL,
  TOGGLE_MAIN_MENU
} from '../actions.js';

import RadialMenu from './RadialMenu.jsx';

const Menu = connect(
  ({view, editor}) => ({
    pixelWidth: view.pixelWidth,
    pixelHeight: view.pixelHeight,
    screenWidth: view.screenWidth,
    screenHeight: view.screenHeight,
    showMainMenu: editor.showMainMenu,
    selectedTool: editor.selectedTool
  })
)(({dispatch, ...props}) => (
  <svg width={props.screenWidth} height={props.screenHeight} viewBox={`0 0 ${props.pixelWidth} ${props.pixelHeight}`}>
    <RadialMenu
      screenWidth={props.pixelWidth}
      screenHeight={props.pixelHeight}
      showMenu={props.showMainMenu}
      selectedTool={props.selectedTool}
      onToolSelected={tool => dispatch({
        type: SET_SELECTED_TOOL,
        tool
      })}
      onClick={() => dispatch({
        type: TOGGLE_MAIN_MENU
      })}
    />
  </svg>
));

export default Menu;