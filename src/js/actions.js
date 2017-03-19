import { isEmpty } from 'ekkiog-editing';

export const RESIZE = 'resize';
export const GL = 'gl';
export const SET_SELECTED_TOOL = 'setSelectedTool';
export const TOGGLE_EDITOR_MENU = 'toggleEditorMenu';

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
export const SET_OK_CANCEL_MENU_VALID = 'setOkCancelMenuValid';
export const RESET_EDITOR_MENU = 'resetEditorMenu';

export const INSERT_COMPONENT = 'insertComponent';
export const SELECT_COMPONENT = 'selectComponent';
export const START_SELECTION = 'startSelection';
export const STOP_SELECTION = 'stopSelection';
export const MOVE_SELECTION = 'moveSelection';

export const resize = (pixelWidth, pixelHeight, screenWidth, screenHeight) => ({
  type: RESIZE,
  pixelWidth,
  pixelHeight,
  screenWidth,
  screenHeight
});

export const panZoom = (matrix, inverse) => ({
  type: PAN_ZOOM,
  matrix,
  inverse
});

export const setSelectedTool = (tool) => ({
  type: SET_SELECTED_TOOL,
  tool
});

export const loadComponent = (name) => async (dispatch, getState) => {
  const database = getState().global.database;
  const forest = await database.load(name);
  dispatch(setForest(name, forest));
};

export const toggleEditorMenu = () => ({
  type: TOGGLE_EDITOR_MENU
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
    emit: true,
    dispatch: true
  }
});

export const setForest = (name, forest) => ({
  type: SET_FOREST,
  name,
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

export const setOkCancelMenuValid = (isValid) => ({
  type: SET_OK_CANCEL_MENU_VALID,
  isValid
});

export const resetEditorMenu = () => ({
  type: RESET_EDITOR_MENU
});

export const insertComponent = (component, position) => (dispatch, getState) => {
  const selection = getState().selection;
  dispatch({
    type: INSERT_COMPONENT,
    component,
    position: {
      x: (position.x|0) + selection.dx,
      y: (position.y|0) + selection.dy
    }
  })
};

export const selectComponent = (component, position) => ({
  type: SELECT_COMPONENT,
  component,
  position
});

export const startSelection = (top, left, right, bottom) => (dispatch, getState) => {
  dispatch({
    type: START_SELECTION,
    meta: {
      emit: true
    },
    top,
    left,
    right,
    bottom
  });
  const state = getState();
  const isValid = isEmpty(
    state.forest.enneaTree,
    top,
    left,
    right,
    bottom);
  dispatch(setOkCancelMenuValid(isValid));
};

export const moveSelection = (dx, dy) => ({
  type: MOVE_SELECTION,
  dx,
  dy
});

export const stopSelection = () => ({
  type: STOP_SELECTION,
  meta: {
    emit: true,
    dispatch: true
  }
});

export const insertComponentPackage = (componentPackage) => (dispatch, getState) => {
  const state = getState();
  const centerTile = {
    x: state.view.centerTile.x|0,
    y: state.view.centerTile.y|0
  };
  const top = centerTile.y - (componentPackage.height>>1);
  const left = centerTile.x - (componentPackage.width>>1);
  const right = centerTile.x - (componentPackage.width>>1) + componentPackage.width;
  const bottom = centerTile.y - (componentPackage.height>>1) + componentPackage.height;

  dispatch(showOkCancelMenu(
    () => {
      dispatch(stopSelection());
      dispatch(insertComponent(componentPackage, centerTile));
      dispatch(resetEditorMenu());
    },
    () => {
      dispatch(stopSelection());
      dispatch(resetEditorMenu());
    }
  ));
  dispatch(startSelection(top, left, right, bottom));
  dispatch(selectComponent(componentPackage, centerTile));
}