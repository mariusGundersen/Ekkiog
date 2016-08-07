export const RESIZE = 'resize';
export const GL = 'gl';
export const SET_SELECTED_TOOL = 'setSelectedTool';
export const TOGGLE_MAIN_MENU = 'toggleMainMenu';

export const START_LONG_PRESS = 'startLongPress';
export const SHOW_CONTEXT_MENU = 'showContextMenu';
export const CANCEL_LONG_PRESS = 'cancelLongPress';
export const HIDE_CONTEXT_MENU = 'hideContextMenu';

export const PAN_ZOOM = 'panZoom';

export const REMOVE_TILE_AT = 'removeTileAt';
export const TO_UNDERPASS = 'toUnderpass';
export const TO_WIRE = 'toWire';

export function setSelectedTool(tool){
  return {
    type: SET_SELECTED_TOOL,
    tool
  };
}

export function toggleMainMenu(){
  return {
    type: TOGGLE_MAIN_MENU
  };
}

export function hideContextMenu(){
  return {
    type: HIDE_CONTEXT_MENU
  };
}

export function removeTileAt(tx, ty){
  return {
    type: REMOVE_TILE_AT,
    meta: {
      emit: 'removeTileAt'
    },
    tx,
    ty
  };
}

export function toUnderpass(tx, ty){
  return {
    type: TO_UNDERPASS,
    meta: {
      emit: 'toUnderpass'
    },
    tx,
    ty
  };
}

export function toWire(tx, ty){
  return {
    type: TO_WIRE,
    meta: {
      emit: 'toWire'
    },
    tx,
    ty
  };
}
