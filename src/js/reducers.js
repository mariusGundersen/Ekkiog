import {EventEmitter} from 'events';
import { combineReducers } from 'redux';

import {
  RESIZE,
  GL,
  SET_SELECTED_TOOL,
  TOGGLE_MAIN_MENU
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

const ekkiogApp = combineReducers({
  view,
  global,
  editor
});

export default ekkiogApp;