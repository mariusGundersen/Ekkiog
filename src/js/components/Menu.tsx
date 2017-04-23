import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import style from './main.css';

import { State } from '../reduce';
import { ContextMenuState } from '../reducers/contextMenu';
import { EditorState } from '../reducers/editor';
import { EditorMenuState } from '../reducers/editorMenu';
import EditorMenu from './EditorMenu';
import ContextMenu from './ContextMenu';

export interface Props {
  dispatch : Dispatch<State>,
  pixelWidth : number,
  pixelHeight : number,
  contextMenu : ContextMenuState,
  editor : EditorState,
  editorMenu : EditorMenuState
}

export default connect(
  ({view, contextMenu, editor, editorMenu} : State) => ({
    pixelWidth: view.pixelWidth/devicePixelRatio,
    pixelHeight: view.pixelHeight/devicePixelRatio,
    contextMenu,
    editor,
    editorMenu
  })
)(({dispatch, ...props} : Props) => {
  const radius = 40;
  const gap = 10;
  const cx = props.pixelWidth;
  const cy = props.pixelHeight;

  return (
    <svg
      className={style.svg}
      width={props.pixelWidth}
      height={props.pixelHeight}
      viewBox={`0 0 ${props.pixelWidth} ${props.pixelHeight}`}>
      <EditorMenu cx={cx} cy={cy} radius={radius} gap={gap} width={radius+gap} editor={props.editor} editorMenu={props.editorMenu} dispatch={dispatch} />
      <ContextMenu radius={radius+gap} width={radius+gap} dispatch={dispatch} contextMenu={props.contextMenu} />
    </svg>
  )
});
