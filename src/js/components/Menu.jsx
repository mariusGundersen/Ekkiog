import React from 'react';
import {connect} from 'react-redux';

import {
  SET_SELECTED_TOOL,
  TOGGLE_EDITOR_MENU
} from '../actions.js';

import style from './main.css';

import EditorMenu from './EditorMenu.jsx';
import ContextMenu from './ContextMenu.jsx';

const Menu = connect(
  ({view, contextMenu, editor, editorMenu}) => ({
    pixelWidth: view.pixelWidth,
    pixelHeight: view.pixelHeight,
    screenWidth: view.screenWidth,
    screenHeight: view.screenHeight,
    contextMenu,
    editor,
    editorMenu
  })
)(({dispatch, ...props}) => {
  const radius = 40;
  const gap = 10;
  const cx = props.screenWidth;
  const cy = props.screenHeight;

  return (
    <svg
      className={style.svg}
      width={props.screenWidth}
      height={props.screenHeight}
      viewBox={`0 0 ${props.screenWidth} ${props.screenHeight}`}>
      <EditorMenu cx={cx} cy={cy} radius={radius} gap={gap} width={radius+gap} editor={props.editor} editorMenu={props.editorMenu} dispatch={dispatch} />
      <ContextMenu radius={radius+gap} width={radius+gap} dispatch={dispatch} {...props.contextMenu} />
    </svg>
  )
});

export default Menu;