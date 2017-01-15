import getTypeAt from './editing/query/getTypeAt.js';

import {
  MOVE_GATE,
  tapTile,
  loadContextMenu,
  abortLoadContextMenu,
  showContextMenu,
  hideContextMenu,
  showOkCancelMenu,
  resetMainMenu
} from './actions.js';

import {
  TAP,
  SHOW_CONTEXT_MENU,
  LOAD_CONTEXT_MENU,
  ABORT_LOAD_CONTEXT_MENU,
  START_SELECTION,
  MOVE_SELECTION,
  CANCEL_SELECTION,
  OK_SELECTION_MOVE
} from './events.js';

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
  //emitter.on(MOVE_GATE, handleMoveGate(editor, emitter, dispatch));
  //emitter.on(MOVE_SELECTION, handleMoveSelection(editor, getContext, renderer, saveContext));
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

/*
export function handleMoveGate(editor, emitter, dispatch){
  return ({tx, ty}) => {
    const [gateX, gateY] = editor.query.getGateOutput(tx, ty);
    dispatch(hideContextMenu());
    emitter.emit(START_SELECTION, {
      top: gateY-1,
      left: gateX-3,
      right: gateX,
      bottom: gateY+1
    });
    dispatch(showOkCancelMenu(
      () => {
        emitter.emit(OK_SELECTION_MOVE, {});
        dispatch(resetMainMenu());
      },
      () => {
        emitter.emit(CANCEL_SELECTION, {});
        dispatch(resetMainMenu());
      }
    ));
  };
}

export function handleMoveSelection(editor, getContext, renderer, saveContext){
  return ({top, left, right, bottom, dx, dy}) => {
    editor.moveSelection(top, left, right, bottom, dx, dy);
    edited(getContext(), renderer, saveContext);
  };
}*/
