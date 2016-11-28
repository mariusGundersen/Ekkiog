export const RESIZE = 'resize';
export const GL = 'gl';
export const SET_SELECTED_TOOL = 'setSelectedTool';
export const TOGGLE_MAIN_MENU = 'toggleMainMenu';

export const LOAD_CONTEXT_MENU = 'loadContextMenu';
export const SHOW_CONTEXT_MENU = 'showContextMenu';
export const ABORT_LOAD_CONTEXT_MENU = 'abortLoadContextMenu';
export const HIDE_CONTEXT_MENU = 'hideContextMenu';

export const PAN_ZOOM = 'panZoom';

export const SET_FOREST = 'set-forest';
export const TAP_TILE = 'tap-tile';
export const REMOVE_TILE_AT = 'remove-tile-at';
export const TO_UNDERPASS = 'convert-wire-to-underpass';
export const TO_WIRE = 'convert-underpass-to-wire';

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

export const loadContextMenu = (x, y) => ({
  type: LOAD_CONTEXT_MENU,
  x,
  y
});

export const abortLoadContextMenu = () => ({
  type: ABORT_LOAD_CONTEXT_MENU
});

export const showContextMenu = (tile, tx, ty) => ({
  type: SHOW_CONTEXT_MENU,
  tile,
  tx,
  ty
});

export const hideContextMenu = () => ({
  type: HIDE_CONTEXT_MENU,
  meta: {
    emit: true
  }
});

export const setForest = (forest) => ({
  type: SET_FOREST,
  forest
});

export const tapTile = (tx, ty, tool) => ({
  type: TAP_TILE,
  x: tx,
  y: ty,
  tool
});

export const removeTileAt = (tx, ty) => ({
  type: REMOVE_TILE_AT,
  x: tx,
  y: ty
});

export const toUnderpass = (tx, ty) => ({
  type: TO_UNDERPASS,
  x: tx,
  y: ty
});

export const toWire = (tx, ty) => ({
  type: TO_WIRE,
  x: tx,
  y: ty
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