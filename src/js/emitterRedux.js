import getTypeAt from './editing/query/getTypeAt.js';

import {
  REMOVE_TILE_AT,
  TO_UNDERPASS,
  TO_WIRE,
  MOVE_GATE,
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

export function createEmitterMiddleware(emitter){
  return ({getState, dispatch}) => next => action => {
    if(action.meta && typeof(action.meta) == 'object' && action.meta.emit === true){
      emitter.emit(action.type, action);
    }
    return next(action)
  };
}

export function fromEmitter(emitter, perspective, store){
  const dispatch = store.dispatch;
  emitter.on(TAP, handleTap(perspective, dispatch, store));
  emitter.on(SHOW_CONTEXT_MENU, handleShowContextMenu(perspective, dispatch, store));
  emitter.on(REMOVE_TILE_AT, handleRemoveTileAt(dispatch));
  emitter.on(TO_UNDERPASS, handleConvertToUnderpass(dispatch));
  emitter.on(TO_WIRE, handleConvertToWire(dispatch));
  //emitter.on(MOVE_GATE, handleMoveGate(editor, emitter, dispatch));
  //emitter.on(MOVE_SELECTION, handleMoveSelection(editor, getContext, renderer, saveContext));
  emitter.on(LOAD_CONTEXT_MENU, handleLoadContextMenu(dispatch));
  emitter.on(ABORT_LOAD_CONTEXT_MENU, handleAbortContextMenu(dispatch));
}

export function handleTap(perspective, dispatch, store){
  return ({x, y}) => {
    const [tx, ty] = perspective.viewportToTileFloored(x, y);

    window.requestAnimationFrame(() => {
      dispatch({
        type: 'tap-tile',
        x: tx,
        y: ty,
        tool: store.getState().editor.selectedTool
      });
    });
  };
}

export function handleShowContextMenu(perspective, dispatch, store){
  return ({x, y}) => {
    const [tx, ty] = perspective.viewportToTile(x, y);
    const tile = getTypeAt(store.getState().forest.enneaTree, Math.floor(tx), Math.floor(ty));
    dispatch(showContextMenu(
      tile,
      tx,
      ty));
  };
}

export function handleRemoveTileAt(dispatch){
  return ({tx, ty}) => {
    dispatch({
      type: 'clear-tile',
      x: tx,
      y: ty
    });

    dispatch(hideContextMenu());
  };
}

export function handleConvertToUnderpass(dispatch){
  return ({tx, ty}) => {
    dispatch({
      type: 'convert-wire-to-underpass',
      x: tx,
      y: ty
    });

    dispatch(hideContextMenu());
  };
}

export function handleConvertToWire(dispatch){
  return ({tx, ty}) => {
    dispatch({
      type: 'convert-underpass-to-wire',
      x: tx,
      y: ty
    });

    dispatch(hideContextMenu());
  };
}

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
