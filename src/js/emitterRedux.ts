import { EventEmitter } from 'events';

import {
  getTypeAt,
  isEmpty
} from 'ekkiog-editing';

import { Dispatch } from 'react-redux';

import {
  tapTile,
  loadContextMenu,
  abortLoadContextMenu,
  showContextMenu,
  setOkCancelMenuValid,
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

import Engine from './engines/Engine';

type ViewportToTile = (x : number, y : number) => [number, number];

export default function fromEmitter(
  emitter : EventEmitter,
  viewportToTile : ViewportToTile,
  dispatch : Dispatch<Action>){
  dispatchOn(emitter, dispatch, {
    [TAP]: handleTap(viewportToTile),
    [DOUBLE_TAP]: handleDoubleTap(viewportToTile),
    [SHOW_CONTEXT_MENU]: handleShowContextMenu(viewportToTile),
    [LOAD_CONTEXT_MENU]: handleLoadContextMenu(viewportToTile),
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

export function handleTap(viewportToTile : ViewportToTile){
  return ({x, y} : {x : number, y : number}) =>
    (dispatch : Dispatch<Action>, getState : () => State) => {
      const [tx, ty] = viewportToTile(x, y).map(Math.floor);
      if(tx < 0 || ty < 0 || tx > 128 || ty > 128) return;
      const {editor : {selectedTool, toolDirection}} = getState();
      dispatch(tapTile(tx, ty, selectedTool, toolDirection));
  };
}

export function handleDoubleTap(viewportToTile : ViewportToTile){
  return ({x, y} : {x : number, y : number}) =>
    (dispatch : Dispatch<Action>) => {
      const [tx, ty] = viewportToTile(x, y);
      if(tx < 0 || ty < 0 || tx > 128 || ty > 128){
        dispatch(zoomOutOf());
      }else{
        dispatch(zoomInto(tx, ty));
      }
  };
}

export function handleShowContextMenu(viewportToTile : ViewportToTile){
  return ({x, y} : {x : number, y : number}) =>
    (dispatch : Dispatch<Action>, getState : () => State) => {
      const [tx, ty] = viewportToTile(x, y);
      if(tx < 0 || ty < 0 || tx > 128 || ty > 128){
        dispatch(abortLoadContextMenu());
      }else{
        const context = getState().context;

        const enneaTree = context.forest.enneaTree;
        const tile = getTypeAt(enneaTree, Math.floor(tx), Math.floor(ty));
        dispatch(showContextMenu(
          tile,
          tx,
          ty));
      }
    };
}

export function handleLoadContextMenu(viewportToTile : ViewportToTile){
  return ({x, y} : {x : number, y : number}) => {
    const [tx, ty] = viewportToTile(x, y);
    if(tx < 0 || ty < 0 || tx > 128 || ty > 128){
      return abortLoadContextMenu();
    }else{
      return loadContextMenu(x, y);
    }
  };
}

export function handleAbortContextMenu(){
  return abortLoadContextMenu();
}

export function handleMoveSelection({dx, dy} : {dx : number, dy : number}){
  return (dispatch : Dispatch<Action>, getState : () => State) => {
    dispatch(moveSelection(dx, dy));
    const state = getState();

    const selection = state.selection;
    if(!selection.selection) return;
    const isValid = isEmpty(
      state.context.forest.enneaTree,
      selection.top + selection.dy,
      selection.left + selection.dx,
      selection.right + selection.dx,
      selection.bottom + selection.dy);
    dispatch(setOkCancelMenuValid(isValid));
  };
}
