import getTypeAt from './editing/query/getTypeAt.js';

import {
  MOVE_GATE,
  tapTile,
  loadContextMenu,
  abortLoadContextMenu,
  showContextMenu,
  hideContextMenu,
  showOkCancelMenu,
  setOkCancelMenuValid,
  resetMainMenu,
  moveSelection
} from './actions.js';

import {
  TAP,
  SHOW_CONTEXT_MENU,
  LOAD_CONTEXT_MENU,
  ABORT_LOAD_CONTEXT_MENU,
  START_SELECTION,
  MOVE_SELECTION,
  STOP_SELECTION
} from './events.js';

import isEmpty from './editing/query/isEmpty.js';

export function createEmitterMiddleware(){
  return ({getState}) => next => action => {
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

export function fromEmitter(emitter, viewportToTile, getState, dispatch){
  emitter.on(TAP, handleTap(viewportToTile, dispatch, getState));
  emitter.on(SHOW_CONTEXT_MENU, handleShowContextMenu(viewportToTile, dispatch, getState));
  emitter.on(LOAD_CONTEXT_MENU, handleLoadContextMenu(dispatch));
  emitter.on(ABORT_LOAD_CONTEXT_MENU, handleAbortContextMenu(dispatch));
  emitter.on(MOVE_SELECTION, handleMoveSelection(dispatch, getState));
}

export function handleTap(viewportToTile, dispatch, getState){
  return ({x, y}) => {
    const [tx, ty] = viewportToTile(x, y);
    const tool = getState().editor.selectedTool;

    window.requestAnimationFrame(() => {
      dispatch(tapTile(Math.floor(tx), Math.floor(ty), tool));
    });
  };
}

export function handleShowContextMenu(viewportToTile, dispatch, getState){
  return ({x, y}) => {
    const [tx, ty] = viewportToTile(x, y);
    const enneaTree = getState().forest.enneaTree;
    const tile = getTypeAt(enneaTree, Math.floor(tx), Math.floor(ty));
    dispatch(showContextMenu(
      tile,
      tx,
      ty));
  };
}

export function handleLoadContextMenu(dispatch){
  return ({x, y}) => {
    dispatch(loadContextMenu(
      x/window.devicePixelRatio,
      y/window.devicePixelRatio));
  };
}

export function handleAbortContextMenu(dispatch){
  return ({x, y}) => {
    dispatch(abortLoadContextMenu());
  };
}

export function handleMoveSelection(dispatch, getState){
  return ({dx, dy}) => {
    dispatch(moveSelection(dx, dy));
    const state = getState();
    const selection = state.selection;
    const isValid = isEmpty(
      state.forest.enneaTree,
      selection.top + selection.dy,
      selection.left + selection.dx,
      selection.right + selection.dx,
      selection.bottom + selection.dy);
    dispatch(setOkCancelMenuValid(isValid));
  };
}
