import {
  TOGGLE_MAIN_MENU,
  SHOW_CONTEXT_MENU,
  HIDE_CONTEXT_MENU,
  SHOW_OK_CANCEL_MENU,
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
