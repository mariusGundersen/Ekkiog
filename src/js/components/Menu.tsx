import * as React from 'react';
import { Dispatch } from 'redux';

import style from './main.css';

import { ContextMenuState } from '../reduce/contextMenu';
import { EditorState } from '../reduce/editor';
import { EditorMenuState } from '../reduce/editorMenu';
import { ViewState } from '../reduce/view';
import EditorMenu from './EditorMenu';
import ContextMenu from './ContextMenu';
import ContextMenuLoading from './ContextMenuLoading';
import { Action } from '../actions';
import { Forest } from '../editing';
import { tileToViewport } from '../reduce/perspective';

const radius = 40;
const gap = 10;

export interface Props {
  readonly dispatch: Dispatch<Action>,
  readonly width: number,
  readonly height: number,
  readonly contextMenu: ContextMenuState,
  readonly view: ViewState,
  readonly editor: EditorState,
  readonly editorMenu: EditorMenuState
  readonly forest: Forest
}

export default (props: Props) => {
  const cx = props.width;
  const cy = props.height;

  return (
    <svg
      className={style.svg}
      width={props.width}
      height={props.height}
      viewBox={`0 0 ${props.width} ${props.height}`}>
      <filter id="dropshadow" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
        <feOffset dx="0" dy="2" result="offsetblur" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <EditorMenu cx={cx} cy={cy} radius={radius} gap={gap} width={radius + gap} editor={props.editor} editorMenu={props.editorMenu} dispatch={props.dispatch} />
      <ContextMenuPos {...props} />
    </svg>
  )
};

const ContextMenuPos = (props: Props) => {
  if (props.contextMenu.type === 'load') {
    const { tx, ty } = props.contextMenu;
    const [x, y] = tileToViewport(props.view.perspective, tx, ty);
    return <ContextMenuLoading
      x={x / window.devicePixelRatio}
      y={y / window.devicePixelRatio}
      width={radius + gap}
      radius={radius + gap} />;
  } else if (props.contextMenu.type === 'show') {
    const { tx, ty } = props.contextMenu;
    const [x, y] = tileToViewport(props.view.perspective, tx, ty);
    return <ContextMenu
      radius={radius + gap}
      width={radius + gap}
      dispatch={props.dispatch}
      contextMenu={props.contextMenu}
      forest={props.forest}
      x={x / window.devicePixelRatio}
      y={y / window.devicePixelRatio} />;
  } else {
    return null;
  }
}
