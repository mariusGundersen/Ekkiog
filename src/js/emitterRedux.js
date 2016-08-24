import {
  REMOVE_TILE_AT,
  TO_UNDERPASS,
  TO_WIRE,
  MOVE_GATE,
  startLongPress,
  cancelLongPress,
  showContextMenu,
  hideContextMenu,
  startMove,
  setMove,
  stopMove
} from './actions.js';

import {
  TAP,
  LONG_PRESS,
  POTENTIAL_LONG_PRESS,
  POTENTIAL_LONG_PRESS_CANCEL,
  START_SELECTION
} from './events.js';

export function toEmitterMiddleware(emitter){
  return ({getState, dispatch}) => next => action => {
    if(action.meta && typeof(action.meta) == 'object' && action.meta.emit === true){
      emitter.emit(action.type, action);
    }
    return next(action)
  };
}

export function fromEmitter(emitter, editor, perspective, context, renderer, storage, store){
  emitter.on(TAP, tap(editor, perspective, context, renderer, storage, store.dispatch, store));
  emitter.on(LONG_PRESS, longPress(editor, perspective, store.dispatch));
  emitter.on(REMOVE_TILE_AT, removeTileAt(editor, context, renderer, storage, store.dispatch));
  emitter.on(TO_UNDERPASS, toUnderpass(editor, context, renderer, storage, store.dispatch));
  emitter.on(TO_WIRE, toWire(editor, context, renderer, storage, store.dispatch));
  emitter.on(MOVE_GATE, moveGate(editor, emitter, store.dispatch));
  emitter.on(POTENTIAL_LONG_PRESS, potentialLongPress(store.dispatch));
  emitter.on(POTENTIAL_LONG_PRESS_CANCEL, potentialLongPressCancel(store.dispatch));
}

export function tap(editor, perspective, context, renderer, storage, dispatch, store){
  return ({x, y}) => {
    const [tx, ty] = perspective.viewportToTileFloored(x, y);

    window.requestAnimationFrame(() => {
      if(editor.query.isButton(tx, ty)){
        editor.toggleButton(tx, ty);

        context.gatesTexture.update();

        renderer.simulateTick(context, renderer.currentTick);

        storage.save(context.export());
      }else{
        const tool = store.getState().editor.selectedTool;
        if(editor.edit(tx, ty, tool)){
          edited(context, renderer, storage);
        }
      }
    })
  };
}

export function longPress(editor, perspective, dispatch){
  return ({x, y}) => {
    const [tx, ty] = perspective.viewportToTile(x, y);
    const tile = editor.getTileAt(Math.floor(tx), Math.floor(ty));
    dispatch(showContextMenu(
      tile,
      tx,
      ty));
  };
}

export function removeTileAt(editor, context, renderer, storage, dispatch){
  return ({tx, ty}) => {
    if(editor.clear(tx, ty)){
      edited(context, renderer, storage);
    }

    dispatch(hideContextMenu());
  };
}

export function toUnderpass(editor, context, renderer, storage, dispatch){
  return ({tx, ty}) => {
    if(editor.drawUnderpass(tx, ty)){
      edited(context, renderer, storage);
    }

    dispatch(hideContextMenu());
  };
}

export function toWire(editor, context, renderer, storage, dispatch){
  return ({tx, ty}) => {
    if(editor.drawWire(tx, ty)){
      edited(context, renderer, storage);
    }

    dispatch(hideContextMenu());
  };
}

export function moveGate(editor, emitter, dispatch){
  return ({tx, ty}) => {
    const [gateX, gateY] = editor.query.getGateOutput(tx, ty);
    console.log('emit');
    emitter.emit(START_SELECTION, {
      top: gateY-1,
      left: gateX-3,
      right: gateX,
      bottom: gateY+1
    });
    dispatch(hideContextMenu());
  };
}

export function potentialLongPress(dispatch){
  return ({x, y}) => {
    dispatch(startLongPress(
      x/window.devicePixelRatio,
      y/window.devicePixelRatio));
  };
}

export function potentialLongPressCancel(dispatch){
  return ({x, y}) => {
    dispatch(cancelLongPress());
  };
}

function edited(context, renderer, storage){
  context.mapTexture.update();
  context.netMapTexture.update();
  context.gatesTexture.update();

  renderer.renderMap(context);

  storage.save(context.export());
}