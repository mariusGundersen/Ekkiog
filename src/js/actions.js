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

export const resize = (pixelWidth, pixelHeight, screenWidth, screenHeight) => ({
  type: RESIZE,
  pixelWidth,
  pixelHeight,
  screenWidth,
  screenHeight
});

export const panZoom = (dx, dy) => ({
  type: PAN_ZOOM,
  dx,
  dy
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

export const showContextMenu = (x, y, tile, tx, ty) => ({
  type: SHOW_CONTEXT_MENU,
  x,
  y,
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
    emit: 'removeTileAt'
  },
  tx,
  ty
});

export const toUnderpass = (tx, ty) => ({
  type: TO_UNDERPASS,
  meta: {
    emit: 'toUnderpass'
  },
  tx,
  ty
});

export const toWire = (tx, ty) => ({
  type: TO_WIRE,
  meta: {
    emit: 'toWire'
  },
  tx,
  ty
});
