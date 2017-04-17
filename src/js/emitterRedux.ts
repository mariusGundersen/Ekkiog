import { EventEmitter } from 'events';

import { getTypeAt, isEmpty } from 'ekkiog-editing';

import {Dispatch, Store} from 'react-redux';

import {
  Action,
  tapTile,
  loadContextMenu,
  abortLoadContextMenu,
  showContextMenu,
  setOkCancelMenuValid,
  moveSelection
} from './actions';
import { State } from './reduce';
import {
  TAP,
  SHOW_CONTEXT_MENU,
  LOAD_CONTEXT_MENU,
  ABORT_LOAD_CONTEXT_MENU,
  MOVE_SELECTION
} from './events';

type ViewportToTile = (x : number, y : number) => [number, number];

export function createEmitterMiddleware(){
  return ({getState} : Store<State>) => (next : Dispatch<State>) => (action : any) => {
    if(action.meta && typeof(action.meta) == 'object' && action.meta.emit === true){
      getState().global.emitter.emit(action.type, action);
      if(action.meta.dispatch === true){
        return next(action);
      }
    }else{
      return next(action);
    }
  };
}

export function fromEmitter(emitter : EventEmitter, viewportToTile : ViewportToTile, dispatch : Dispatch<State>, getState : () => State){
  emitter.on(TAP, handleTap(viewportToTile, dispatch, getState));
  emitter.on(SHOW_CONTEXT_MENU, handleShowContextMenu(viewportToTile, dispatch, getState));
  emitter.on(LOAD_CONTEXT_MENU, handleLoadContextMenu(dispatch));
  emitter.on(ABORT_LOAD_CONTEXT_MENU, handleAbortContextMenu(dispatch));
  emitter.on(MOVE_SELECTION, handleMoveSelection(dispatch, getState));
}

export function handleTap(viewportToTile : ViewportToTile, dispatch : Dispatch<State>, getState : () => State){
  return ({x, y} : {x : number, y : number}) => {
    const [tx, ty] = viewportToTile(x, y);
    const {selectedTool, toolDirection} = getState().editor;

    window.requestAnimationFrame(() => {
      dispatch(tapTile(Math.floor(tx), Math.floor(ty), selectedTool, toolDirection));
    });
  };
}

export function handleShowContextMenu(viewportToTile : ViewportToTile, dispatch : Dispatch<State>, getState : () => State){
  return ({x, y} : {x : number, y : number}) => {
    const [tx, ty] = viewportToTile(x, y);
    const enneaTree = getState().forest.enneaTree;
    const tile = getTypeAt(enneaTree, Math.floor(tx), Math.floor(ty));
    dispatch(showContextMenu(
      tile,
      tx,
      ty));
  };
}

export function handleLoadContextMenu(dispatch : Dispatch<State>){
  return ({x, y} : {x : number, y : number}) => {
    dispatch(loadContextMenu(
      x/window.devicePixelRatio,
      y/window.devicePixelRatio));
  };
}

export function handleAbortContextMenu(dispatch : Dispatch<State>){
  return ({x, y} : {x : number, y : number}) => {
    dispatch(abortLoadContextMenu());
  };
}

export function handleMoveSelection(dispatch : Dispatch<State>, getState : () => State){
  return ({dx, dy} : {dx : number, dy : number}) => {
    dispatch(moveSelection(dx, dy));
    const state = getState();
    const selection = state.selection;
    if(!selection.selection) return;
    const isValid = isEmpty(
      state.forest.enneaTree,
      selection.top + selection.dy,
      selection.left + selection.dx,
      selection.right + selection.dx,
      selection.bottom + selection.dy);
    dispatch(setOkCancelMenuValid(isValid));
  };
}
