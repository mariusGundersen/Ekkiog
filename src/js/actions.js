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

export const MOVE_GATE = 'moveGate';

export const SHOW_OK_CANCEL_MENU = 'showOkCancelMenu';
export const RESET_MAIN_MENU = 'resetMainMenu';

export const resize = (pixelWidth, pixelHeight, screenWidth, screenHeight) => ({
  type: RESIZE,
  pixelWidth,
  pixelHeight,
  screenWidth,
  screenHeight
});

export const panZoom = (matrix) => ({
  type: PAN_ZOOM,
  matrix
});

export const setSelectedTool = (tool) => ({
  type: SET_SELECTED_TOOL,
  tool
});

export const toggleMainMenu = () => ({
  type: TOGGLE_MAIN_MENU
});

export const startLongPress = (x, y) => ({
  type: START_LONG_PRESS,
  x,
  y
});

export const cancelLongPress = () => ({
  type: CANCEL_LONG_PRESS
});

export const showContextMenu = (tile, tx, ty) => ({
  type: SHOW_CONTEXT_MENU,
  tile,
  tx,
  ty
});

export const hideContextMenu = () => ({
  type: HIDE_CONTEXT_MENU
});

export const removeTileAt = (tx, ty) => ({
  type: REMOVE_TILE_AT,
  meta: {
    emit: true
  },
  tx,
  ty
});

export const toUnderpass = (tx, ty) => ({
  type: TO_UNDERPASS,
  meta: {
    emit: true
  },
  tx,
  ty
});

export const toWire = (tx, ty) => ({
  type: TO_WIRE,
  meta: {
    emit: true
  },
  tx,
  ty
});

export const moveGate = (tx, ty) => ({
  type: MOVE_GATE,
  meta: {
    emit: true
  },
  tx,
  ty
});

export const showOkCancelMenu = (okAction, cancelAction) => ({
  type: SHOW_OK_CANCEL_MENU,
  okAction,
  cancelAction
});

export const resetMainMenu = () => ({
  type: RESET_MAIN_MENU
});