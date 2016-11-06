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

export function toEmitterMiddleware(emitter){
  return ({getState, dispatch}) => next => action => {
    if(action.meta && typeof(action.meta) == 'object' && action.meta.emit === true){
      emitter.emit(action.type, action);
    }
    return next(action)
  };
}

export function fromEmitter(emitter, editor, perspective, getContext, renderer, saveContext, store){
  emitter.on(TAP, handleTap(editor, perspective, getContext, renderer, saveContext, store.dispatch, store));
  emitter.on(SHOW_CONTEXT_MENU, handleShowContextMenu(editor, perspective, store.dispatch));
  emitter.on(REMOVE_TILE_AT, handleRemoveTileAt(editor, getContext, renderer, saveContext, store.dispatch));
  emitter.on(TO_UNDERPASS, handleConvertToUnderpass(editor, getContext, renderer, saveContext, store.dispatch));
  emitter.on(TO_WIRE, handleConvertToWire(editor, getContext, renderer, saveContext, store.dispatch));
  emitter.on(MOVE_GATE, handleMoveGate(editor, emitter, store.dispatch));
  emitter.on(MOVE_SELECTION, handleMoveSelection(editor, getContext, renderer, saveContext));
  emitter.on(LOAD_CONTEXT_MENU, handleLoadContextMenu(store.dispatch));
  emitter.on(ABORT_LOAD_CONTEXT_MENU, handleAbortContextMenu(store.dispatch));
}

export function handleTap(editor, perspective, getContext, renderer, saveContext, dispatch, store){
  return ({x, y}) => {
    const [tx, ty] = perspective.viewportToTileFloored(x, y);

    window.requestAnimationFrame(() => {
      const context = getContext();

      if(editor.getTileAt(tx, ty) === 'button'){
        editor.toggleButton(tx, ty);

        context.gatesTexture.update();

        renderer.simulateTick(context, renderer.currentTick);

        saveContext();
      }else{
        const tool = store.getState().editor.selectedTool;
        if(editor.draw(tx, ty, tool)){
          edited(context, renderer, saveContext);
        }
      }
    })
  };
}

export function handleShowContextMenu(editor, perspective, dispatch){
  return ({x, y}) => {
    const [tx, ty] = perspective.viewportToTile(x, y);
    const tile = editor.getTileAt(Math.floor(tx), Math.floor(ty));
    dispatch(showContextMenu(
      tile,
      tx,
      ty));
  };
}

export function handleRemoveTileAt(editor, getContext, renderer, saveContext, dispatch){
  return ({tx, ty}) => {
    if(editor.clear(tx, ty)){
      edited(getContext(), renderer, saveContext);
    }

    dispatch(hideContextMenu());
  };
}

export function handleConvertToUnderpass(editor, getContext, renderer, saveContext, dispatch){
  return ({tx, ty}) => {
    if(editor.drawUnderpass(tx, ty)){
      edited(getContext(), renderer, saveContext);
    }

    dispatch(hideContextMenu());
  };
}

export function handleConvertToWire(editor, getContext, renderer, saveContext, dispatch){
  return ({tx, ty}) => {
    if(editor.drawWire(tx, ty)){
      edited(getContext(), renderer, saveContext);
    }

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

function edited(context, renderer, saveContext){
  context.mapTexture.update();
  context.netMapTexture.update();
  context.gatesTexture.update();

  renderer.renderMap(context);

  saveContext();
}