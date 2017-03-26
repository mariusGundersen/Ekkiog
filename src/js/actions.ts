import { isEmpty, Forest, Item, CompiledComponent } from 'ekkiog-editing';
import {vec2, mat3} from 'gl-matrix';

import {Tool} from './editing/types';

import {Dispatch} from 'redux';

import 'redux-thunk';

export const RESIZE : 'resize' = 'resize';
export const GL : 'gl' = 'gl';
export const SET_SELECTED_TOOL : 'setSelectedTool' = 'setSelectedTool';
export const SET_TOOL_DIRECTION = 'setToolDirection';
export const TOGGLE_EDITOR_MENU : 'toggleEditorMenu' = 'toggleEditorMenu';

export const LOAD_CONTEXT_MENU : 'loadContextMenu' = 'loadContextMenu';
export const SHOW_CONTEXT_MENU : 'showContextMenu' = 'showContextMenu';
export const ABORT_LOAD_CONTEXT_MENU : 'abortLoadContextMenu' = 'abortLoadContextMenu';
export const HIDE_CONTEXT_MENU : 'hideContextMenu' = 'hideContextMenu';

export const PAN_ZOOM : 'panZoom' = 'panZoom';

export const SET_FOREST : 'set-forest' = 'set-forest';
export const TAP_TILE : 'tap-tile' = 'tap-tile';
export const REMOVE_TILE_AT : 'remove-tile-at' = 'remove-tile-at';
export const TO_UNDERPASS : 'convert-wire-to-underpass' = 'convert-wire-to-underpass';
export const TO_WIRE : 'convert-underpass-to-wire' = 'convert-underpass-to-wire';

export const MOVE_GATE : 'moveGate' = 'moveGate';

export const SHOW_OK_CANCEL_MENU : 'showOkCancelMenu' = 'showOkCancelMenu';
export const SET_OK_CANCEL_MENU_VALID : 'setOkCancelMenuValid' = 'setOkCancelMenuValid';
export const RESET_EDITOR_MENU : 'resetEditorMenu' = 'resetEditorMenu';

export const INSERT_COMPONENT : 'insertComponent' = 'insertComponent';
export const SELECT_COMPONENT : 'selectComponent' = 'selectComponent';
export const START_SELECTION : 'startSelection' = 'startSelection';
export const STOP_SELECTION : 'stopSelection' = 'stopSelection';
export const MOVE_SELECTION : 'moveSelection' = 'moveSelection';

export const resize = (pixelWidth : number, pixelHeight : number, screenWidth : number, screenHeight : number) => ({
  type: RESIZE,
  pixelWidth,
  pixelHeight,
  screenWidth,
  screenHeight
});

export const panZoom = (matrix : mat3, inverse : mat3) => ({
  type: PAN_ZOOM,
  matrix,
  inverse
});

export const setSelectedTool = (tool : Tool) => ({
  type: SET_SELECTED_TOOL,
  tool
});
export const setToolDirection = (direction : 'left' | 'up' | 'right' | 'down') => ({
  type: SET_TOOL_DIRECTION,
  direction
});

export const loadComponent = (name : string) => async (dispatch : Dispatch<any>, getState : () => any) => {
  const database = getState().global.database;
  const forest = await database.load(name);
  dispatch(setForest(name, forest));
};

export const toggleEditorMenu = () => ({
  type: TOGGLE_EDITOR_MENU
});

export const loadContextMenu = (x : number, y : number) => ({
  type: LOAD_CONTEXT_MENU,
  x,
  y
});

export const abortLoadContextMenu = () => ({
  type: ABORT_LOAD_CONTEXT_MENU
});

export const showContextMenu = (tile : string, tx : number, ty : number) => ({
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

export const setForest = (name : string, forest : Forest) => ({
  type: SET_FOREST,
  name,
  forest
});

export const tapTile = (tx : number, ty : number, tool : Tool, direction : 'up' | 'down' | 'left' | 'right') => ({
  type: TAP_TILE,
  x: tx,
  y: ty,
  tool,
  direction
});

export const removeTileAt = (tx : number, ty : number) => ({
  type: REMOVE_TILE_AT,
  x: tx,
  y: ty
});

export const toUnderpass = (tx : number, ty : number) => ({
  type: TO_UNDERPASS,
  x: tx,
  y: ty
});

export const toWire = (tx : number, ty : number) => ({
  type: TO_WIRE,
  x: tx,
  y: ty
});

export const moveGate = (tx : number, ty : number) => ({
  type: MOVE_GATE,
  meta: {
    emit: true
  },
  tx,
  ty
});

export const showOkCancelMenu = (okAction : () => void, cancelAction : () => void) => ({
  type: SHOW_OK_CANCEL_MENU,
  okAction,
  cancelAction
});

export const setOkCancelMenuValid = (isValid : boolean) => ({
  type: SET_OK_CANCEL_MENU_VALID,
  isValid
});

export const resetEditorMenu = () => ({
  type: RESET_EDITOR_MENU
});

export const insertComponent = (component : CompiledComponent, position : {x : number, y : number}) => (dispatch : Dispatch<any>, getState : () => any) => {
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

export const selectComponent = (component : CompiledComponent, position : {x : number, y : number}) => ({
  type: SELECT_COMPONENT,
  component,
  position
});

export const startSelection = (top : number, left : number, right : number, bottom : number) => (dispatch : Dispatch<any>, getState : () => any) => {
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

export const moveSelection = (dx : number, dy : number) => ({
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

export const insertComponentPackage = (componentPackage : CompiledComponent) => (dispatch : Dispatch<any>, getState : () => any) => {
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