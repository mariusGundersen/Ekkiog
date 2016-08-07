import {
  resize,
  panZoom,
  startLongPress,
  cancelLongPress,
  showContextMenu,
  hideContextMenu
} from './actions.js';

export function toEmitterMiddleware(emitter){
  return ({getState, dispatch}) => next => action => {
    if(action.meta && typeof(action.meta) == 'object' && action.meta.emit){
      emitter.emit(action.meta.emit, action);
    }
    return next(action)
  };
}

export function fromEmitter(emitter, editor, perspective, context, renderer, storage, store){
  emitter.on('tap', tap(editor, perspective, context, renderer, storage, store.dispatch, store));
  emitter.on('longPress', longPress(editor, perspective, store.dispatch));
  emitter.on('removeTileAt', removeTileAt(editor, context, renderer, storage, store.dispatch));
  emitter.on('toUnderpass', toUnderpass(editor, context, renderer, storage, store.dispatch));
  emitter.on('toWire', toWire(editor, context, renderer, storage, store.dispatch));
  emitter.on('potentialLongPress', potentialLongPress(store.dispatch));
  emitter.on('potentialLongPressCancel', potentialLongPressCancel(store.dispatch));
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

export function toWire(editor, context, renderer, storage, dispatch){
  return ({tx, ty}) => {
    if(editor.drawWire(tx, ty)){
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

export function removeTileAt(editor, context, renderer, storage, dispatch){
  return ({tx, ty}) => {
    if(editor.clear(tx, ty)){
      edited(context, renderer, storage);
    }

    dispatch(hideContextMenu());
  };
}

export function longPress(editor, perspective, dispatch){
  return ({x, y}) => {
    const [tx, ty] = perspective.viewportToTile(x, y);
    const tile = editor.getTileAt(tx, ty);
    dispatch(showContextMenu(
      x/window.devicePixelRatio,
      y/window.devicePixelRatio,
      tile,
      tx,
      ty));
  };
}

export function tap(editor, perspective, context, renderer, storage, dispatch, store){
  return ({x, y}) => {
    const [tx, ty] = perspective.viewportToTile(x, y);

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

function edited(context, renderer, storage){
  context.mapTexture.update();
  context.netMapTexture.update();
  context.gatesTexture.update();

  renderer.renderMap(context);

  storage.save(context.export());
}