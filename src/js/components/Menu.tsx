import * as React from 'react';
import { Dispatch } from 'redux';

import style from './main.css';

import { ContextMenuState } from '../reduce/contextMenu';
import { EditorState } from '../reduce/editor';
import { EditorMenuState } from '../reduce/editorMenu';
import { ViewState } from '../reduce/view';
import ContextMenu from './ContextMenu';
import ContextMenuLoading from './ContextMenuLoading';
import { Action } from '../actions';
import { Forest, getTypeAt, getTileAt, EMPTY } from '../editing';
import { tileToViewport } from '../reduce/perspective';
import { SelectionState } from '../reduce/selection';
import SelectionMenu from './SelectionMenu';

export const RADIUS = 50;

export interface Props {
  readonly dispatch: Dispatch<Action>,
  readonly width: number,
  readonly height: number,
  readonly contextMenu: ContextMenuState,
  readonly selection: SelectionState,
  readonly view: ViewState,
  readonly editor: EditorState,
  readonly editorMenu: EditorMenuState
  readonly forest: Forest
}

export default (props: Props) => {
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
      <ContextMenuPos {...props} />
      <SelectionMenuPos {...props} />
    </svg>
  )
};

const ContextMenuPos = (props: Props) => {
  switch (props.contextMenu.type) {
    case 'load': {
      const { tx, ty } = props.contextMenu;
      const [x, y] = tileToViewport(props.view.perspective, tx, ty);
      return <ContextMenuLoading
        x={x / window.devicePixelRatio}
        y={y / window.devicePixelRatio}
      />;
    }
    case 'show': {
      const { tx, ty } = props.contextMenu;
      const tile = getTileAt(props.forest, Math.floor(tx), Math.floor(ty));
      const tileType = tile?.data?.type ?? EMPTY;
      const [x, y] = tileToViewport(props.view.perspective, tx, ty);
      return <ContextMenu
        dispatch={props.dispatch}
        tileType={tileType}
        permanent={tile?.data?.permanent}
        x={x / window.devicePixelRatio}
        y={y / window.devicePixelRatio}
        tx={Math.floor(tx)}
        ty={Math.floor(ty)}
      />;
    }
    default:
      return null;
  }
}

const SelectionMenuPos = ({ selection, dispatch, view }: Props) => {
  if (!selection) return null;

  const { data: tile } = getTileAt(selection, selection.left, selection.top);

  switch (tile.type) {
    case 'button':
    case 'light':
      const cx = (selection.left + selection.right) / 2 + selection.dx;
      const cy = (selection.top + selection.bottom) / 2 + selection.dy;
      const [x, y] = tileToViewport(view.perspective, cx, cy);
      return <SelectionMenu
        dispatch={dispatch}
        permanent={tile.permanent}
        tileType={tile.type}
        direction={tile.direction}
        x={x / window.devicePixelRatio}
        y={y / window.devicePixelRatio}
      />;
    default:
      return null;
  }
}
