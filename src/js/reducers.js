import { combineReducers } from 'redux';
import { vec2 } from 'gl-matrix';

import forest from './editing/reduce.js';

import {
  RESIZE,
  GL,
  SET_SELECTED_TOOL,
  TOGGLE_MAIN_MENU,
  LOAD_CONTEXT_MENU,
  SHOW_CONTEXT_MENU,
  ABORT_LOAD_CONTEXT_MENU,
  HIDE_CONTEXT_MENU,
  PAN_ZOOM,
  SHOW_OK_CANCEL_MENU,
  RESET_MAIN_MENU
} from './actions.js';

function view(state={
  pixelWidth: 100,
  pixelHeight: 100,
  screenWidth: 100,
  screenHeight: 100
}, action){
  switch(action.type){
    case RESIZE:
      return {
        ...state,
        pixelWidth: action.pixelWidth,
        pixelHeight: action.pixelHeight,
        screenWidth: action.screenWidth,
        screenHeight: action.screenHeight
      };
    default:
      return state;
  }
}

function global(state={
  gl: null
}, action){
  switch(action.type){
    case GL:
      return {
        ...state,
        gl: action.gl
      };
    default:
      return state;
  }
}

function editor(state={
  selectedTool: 'wire'
}, action){
  switch(action.type){
    case SET_SELECTED_TOOL:
      return {
        ...state,
        selectedTool: action.tool
      };
    default:
      return state;
  }
}

function mainMenu(state={
  open: false,
  menuType: 'tools',
  previousMenu: null
}, action){
  switch(action.type){
    case TOGGLE_MAIN_MENU:
      return {
        ...state,
        open: !state.open
      };
    case SHOW_CONTEXT_MENU:
      return {
        ...state,
        menuType: null
      };
    case HIDE_CONTEXT_MENU:
      return {
        ...state,
        menuType: 'tools'
      };
    case SHOW_OK_CANCEL_MENU:
      return {
        ...state,
        open: true,
        menuType: 'okCancel',
        okAction: action.okAction,
        cancelAction: action.cancelAction,
        previousMenu: state
      };
    case RESET_MAIN_MENU:
      return state.previousMenu || state;
    default:
      return state;
  }
}

function contextMenu(state={
  loading: false,
  show: false,
  x: 0,
  y: 0,
  tx: 0,
  ty: 0
}, action){
  switch(action.type){
    case LOAD_CONTEXT_MENU:
      return state.show == false ? {
        ...state,
        x: action.x,
        y: action.y,
        loading: true,
        show: false,
      } : state;
    case SHOW_CONTEXT_MENU:
      return {
        ...state,
        loading: false,
        show: true,
        tile: action.tile,
        tx: action.tx,
        ty: action.ty
      };
    case ABORT_LOAD_CONTEXT_MENU:
      return state.loading ? {
        ...state,
        loading: false,
        show: false
      } : state;
    case PAN_ZOOM:
      return (state.loading || state.show) ? {
          ...state,
          ...transform(action.matrix, state.tx, state.ty)
        } : state;
    case HIDE_CONTEXT_MENU:
      return {
        loading: false,
        show: false,
        x: 0,
        y: 0
      };
    default:
      return state;
  }
}

const ekkiogApp = combineReducers({
  view,
  global,
  editor,
  mainMenu,
  contextMenu,
  forest
});

export default ekkiogApp;

function transform(matrix, ...pos){
  vec2.transformMat3(pos, pos, matrix);
  return {
    x: pos[0]/window.devicePixelRatio,
    y: pos[1]/window.devicePixelRatio
  };
}