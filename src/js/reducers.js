import { combineReducers } from 'redux';
import { vec2 } from 'gl-matrix';

import {
  RESIZE,
  GL,
  SET_SELECTED_TOOL,
  TOGGLE_MAIN_MENU,
  START_LONG_PRESS,
  SHOW_CONTEXT_MENU,
  CANCEL_LONG_PRESS,
  HIDE_CONTEXT_MENU,
  PAN_ZOOM,
  START_MOVE,
  SET_MOVE,
  STOP_MOVE,
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
  selectedTool: 'wire',
  showMainMenu: false
}, action){
  switch(action.type){
    case SET_SELECTED_TOOL:
      return {
        ...state,
        selectedTool: action.tool
      };
    case TOGGLE_MAIN_MENU:
      return {
        ...state,
        showMainMenu: !state.showMainMenu
      };
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
    case START_LONG_PRESS:
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
    case CANCEL_LONG_PRESS:
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

function moveIt(state={
  move: false
}, action){
  switch(action.type){
    case START_MOVE:
      return {
        move: true,
        top: action.top,
        left: action.left,
        right: action.right,
        bottom: action.bottom,
        dx: 0,
        dy: 0
      };
    case SET_MOVE:
      return {
        ...state,
        dx: action.dx,
        dy: action.dy
      };
    case STOP_MOVE:
      return {
        move: false
      };
    default:
      return state;
  }
}

const ekkiogApp = combineReducers({
  view,
  global,
  editor,
  contextMenu,
  moveIt
});

export default ekkiogApp;

function transform(matrix, ...pos){
  vec2.transformMat3(pos, pos, matrix);
  return {
    x: pos[0]/window.devicePixelRatio,
    y: pos[1]/window.devicePixelRatio
  };
}