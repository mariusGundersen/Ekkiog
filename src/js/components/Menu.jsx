import React from 'react';
import {connect} from 'react-redux';

import {
  SET_SELECTED_TOOL,
  TOGGLE_MAIN_MENU
} from '../actions.js';

import MainMenu from './MainMenu.jsx';

const Menu = connect(
  ({view, editor}) => ({
    pixelWidth: view.pixelWidth,
    pixelHeight: view.pixelHeight,
    screenWidth: view.screenWidth,
    screenHeight: view.screenHeight,
    showMainMenu: editor.showMainMenu,
    selectedTool: editor.selectedTool
  })
)(({dispatch, ...props}) => {
  const radius = 40;
  const gap = 10;
  const cx = props.screenWidth - radius - gap;
  const cy = props.screenHeight - radius - gap;

  return (
    <svg width={props.screenWidth} height={props.screenHeight} viewBox={`0 0 ${props.screenWidth} ${props.screenHeight}`}>
      <MainMenu cx={cx} cy={cy} radius={radius} gap={gap} width={radius+gap} showMenu={props.showMainMenu} selectedTool={props.selectedTool} />
    </svg>
  )
});

export default Menu;