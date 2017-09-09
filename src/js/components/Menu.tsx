import * as React from 'react';
import { Dispatch } from 'redux';

import style from './main.css';

import { State } from '../reduce';
import { ContextMenuState } from '../reduce/contextMenu';
import { EditorState } from '../reduce/editor';
import { EditorMenuState } from '../reduce/editorMenu';
import { ViewState } from '../reduce/view';
import EditorMenu from './EditorMenu';
import ContextMenu from './ContextMenu';

export interface Props {
  readonly dispatch : Dispatch<State>,
  readonly pixelWidth : number,
  readonly pixelHeight : number,
  readonly contextMenu : ContextMenuState,
  readonly view : ViewState,
  readonly editor : EditorState,
  readonly editorMenu : EditorMenuState
}

export default ({dispatch, ...props} : Props) => {
  const radius = 40;
  const gap = 10;
  const cx = props.pixelWidth;
  const cy = props.pixelHeight;

  return (
    <svg
      className={style.svg}
      width={props.pixelWidth/window.devicePixelRatio}
      height={props.pixelHeight/window.devicePixelRatio}
      viewBox={`0 0 ${props.pixelWidth} ${props.pixelHeight}`}>
      <filter id="dropshadow" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="5"/>
        <feOffset dx="0" dy="2" result="offsetblur"/>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <EditorMenu cx={cx} cy={cy} radius={radius} gap={gap} width={radius+gap} editor={props.editor} editorMenu={props.editorMenu} dispatch={dispatch} />
      <ContextMenu radius={radius+gap} width={radius+gap} dispatch={dispatch} contextMenu={props.contextMenu} view={props.view} />
    </svg>
  )
};
