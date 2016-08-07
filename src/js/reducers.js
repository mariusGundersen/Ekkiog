import {EventEmitter} from 'events';
import { combineReducers } from 'redux';

import {
  RESIZE,
  GL,
  SET_SELECTED_TOOL,
  TOGGLE_MAIN_MENU,
  START_LONG_PRESS,
  SHOW_CONTEXT_MENU,
  CANCEL_LONG_PRESS,
  PAN_ZOOM
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
  emitter: new EventEmitter(),
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
  y: 0
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
      };
    case CANCEL_LONG_PRESS:
      return state.loading ? {
        ...state,
        loading: false,
        show: false
      } : state;
    case PAN_ZOOM:
      return state.loading || state.show ? {
        ...state,
        x: state.x + action.dx,
        y: state.y + action.dy
      } : state;
    default:
      return state;
  }
}

const ekkiogApp = combineReducers({
  view,
  global,
  editor,
  contextMenu
});

export default ekkiogApp;