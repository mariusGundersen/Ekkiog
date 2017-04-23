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

export default function fromEmitter(emitter : EventEmitter, viewportToTile : ViewportToTile, dispatch : Dispatch<State>){
  dispatchOn(emitter, dispatch, {
    [TAP]: handleTap(viewportToTile),
    [SHOW_CONTEXT_MENU]: handleShowContextMenu(viewportToTile),
    [LOAD_CONTEXT_MENU]: handleLoadContextMenu,
    [ABORT_LOAD_CONTEXT_MENU]: handleAbortContextMenu,
    [MOVE_SELECTION]: handleMoveSelection
  });
}

export function dispatchOn(emitter : EventEmitter, dispatch : Dispatch<State>, eventMap : {
  [event : string] : (event : any) => any
}){
  for(let event in eventMap){
    const map = eventMap[event];
    emitter.on(event, (event : any) => dispatch(map(event)));
  }
}

export function handleTap(viewportToTile : ViewportToTile){
  return ({x, y} : {x : number, y : number}) =>
    (dispatch : Dispatch<State>, getState : () => State) => {
      const [tx, ty] = viewportToTile(x, y);
      const {selectedTool, toolDirection} = getState().editor;

      window.requestAnimationFrame(() => {
        dispatch(tapTile(Math.floor(tx), Math.floor(ty), selectedTool, toolDirection));
      });
  };
}

export function handleShowContextMenu(viewportToTile : ViewportToTile){
  return ({x, y} : {x : number, y : number}) =>
    (dispatch : Dispatch<State>, getState : () => State) => {
      const [tx, ty] = viewportToTile(x, y);
      const enneaTree = getState().forest.enneaTree;
      const tile = getTypeAt(enneaTree, Math.floor(tx), Math.floor(ty));
      dispatch(showContextMenu(
        tile,
        tx,
        ty));
    };
}

export function handleLoadContextMenu({x, y} : {x : number, y : number}){
  return loadContextMenu(
    x,
    y);
}

export function handleAbortContextMenu({x, y} : {x : number, y : number}){
  return abortLoadContextMenu();
}

export function handleMoveSelection({dx, dy} : {dx : number, dy : number}){
  return (dispatch : Dispatch<State>, getState : () => State) => {
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
