import { EventEmitter } from 'events';

import {
  getTypeAt} from 'ekkiog-editing';

import { Dispatch } from 'react-redux';

import {
  tapTile,
  loadContextMenu,
  abortLoadContextMenu,
  showContextMenu,
  moveSelection,
  zoomInto,
  zoomOutOf,
  Action
} from './actions';
import { State } from './reduce';
import {
  TAP,
  DOUBLE_TAP,
  SHOW_CONTEXT_MENU,
  LOAD_CONTEXT_MENU,
  ABORT_LOAD_CONTEXT_MENU,
  MOVE_SELECTION
} from './events';
import { Pos } from './interaction/types';

export default function fromEmitter(
  emitter : EventEmitter,
  dispatch : Dispatch<Action>){
  dispatchOn(emitter, dispatch, {
    [TAP]: handleTap,
    [DOUBLE_TAP]: handleDoubleTap,
    [SHOW_CONTEXT_MENU]: handleShowContextMenu,
    [LOAD_CONTEXT_MENU]: handleLoadContextMenu,
    [ABORT_LOAD_CONTEXT_MENU]: handleAbortContextMenu,
    [MOVE_SELECTION]: handleMoveSelection
  });
}

export function dispatchOn(emitter : EventEmitter, dispatch : Dispatch<Action>, eventMap : {
  [event : string] : (event : any) => any
}){
  for(let event in eventMap){
    const map = eventMap[event];
    emitter.on(event, (event : any) => dispatch(map(event)));
  }
}

export function handleTap({tx, ty} : Pos){
  return (dispatch : Dispatch<Action>, getState : () => State) => {
    tx = Math.floor(tx);
    ty = Math.floor(ty);
    if(tx < 0 || ty < 0 || tx > 128 || ty > 128) return;
    const {editor : {selectedTool, toolDirection}} = getState();
    dispatch(tapTile(tx, ty, selectedTool, toolDirection));
  };
}

export function handleDoubleTap({tx, ty} : Pos) {
  return (dispatch : Dispatch<Action>) => {
    if(tx < 0 || ty < 0 || tx > 128 || ty > 128){
      dispatch(zoomOutOf());
    }else{
      dispatch(zoomInto(tx, ty));
    }
  };
}

export function handleShowContextMenu({tx, ty} : Pos) {
  return (dispatch : Dispatch<Action>, getState : () => State) => {
    if(tx < 0 || ty < 0 || tx > 128 || ty > 128){
      dispatch(abortLoadContextMenu());
    }else{
      const context = getState().context;

      const enneaTree = context.forest.enneaTree;
      const tile = getTypeAt(enneaTree, Math.floor(tx), Math.floor(ty));
      dispatch(showContextMenu(tile, tx, ty));
    }
  };
}

export function handleLoadContextMenu({x, y, tx, ty} : Pos) {
  if(tx < 0 || ty < 0 || tx > 128 || ty > 128){
    return abortLoadContextMenu();
  }else{
    return loadContextMenu(x, y);
  }
}

export function handleAbortContextMenu(){
  return abortLoadContextMenu();
}

export function handleMoveSelection({dx, dy} : {dx : number, dy : number}){
  return moveSelection(dx, dy);
}
