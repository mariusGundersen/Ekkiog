import {
  TOGGLE_EDITOR_MENU,
  SHOW_CONTEXT_MENU,
  HIDE_CONTEXT_MENU,
  SHOW_OK_CANCEL_MENU,
  SET_OK_CANCEL_MENU_VALID,
  RESET_EDITOR_MENU
} from '../actions.js';

export default function editorMenu(state={
  open: false,
  menuType: 'tools',
  previousMenu: null
}, action){
  switch(action.type){
    case TOGGLE_EDITOR_MENU:
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
        isValid: true,
        okAction: action.okAction,
        cancelAction: action.cancelAction,
        previousMenu: state
      };
    case SET_OK_CANCEL_MENU_VALID:
      return {
        ...state,
        isValid: action.isValid
      };
    case RESET_EDITOR_MENU:
      return state.previousMenu || state;
    default:
      return state;
  }
}
