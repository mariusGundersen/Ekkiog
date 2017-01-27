import {
  TOGGLE_MAIN_MENU,
  SHOW_CONTEXT_MENU,
  HIDE_CONTEXT_MENU,
  SHOW_OK_CANCEL_MENU,
  SET_OK_CANCEL_MENU_VALID,
  RESET_MAIN_MENU
} from '../actions.js';

export default function mainMenu(state={
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
    case RESET_MAIN_MENU:
      return state.previousMenu || state;
    default:
      return state;
  }
}
