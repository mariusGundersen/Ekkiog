import {
  Action
} from '../actions';

export interface ContextMenuState {
  readonly menuType : null
  readonly previousMenu : EditorMenuState
}

export interface ToolsMenuState {
  readonly menuType : 'tools',
  readonly open : boolean,
}

export interface OkCancelMenuState {
  readonly menuType : 'okCancel',
  readonly open : true,
  readonly isValid : boolean,
  readonly previousMenu : EditorMenuState,
  okAction() : void,
  cancelAction() : void
}

export type EditorMenuState = ToolsMenuState | OkCancelMenuState | ContextMenuState;

export default function editorMenu(state : EditorMenuState = {
  open: false,
  menuType: 'tools'
}, action : Action) : EditorMenuState {
  switch(action.type){
    case 'toggleEditorMenu':
      return state.menuType == 'tools'
        ? {
          ...state,
          open: !state.open
        } : state;
    case 'showContextMenu':
      return {
        menuType: null,
        previousMenu: state
      };
    case 'hideContextMenu':
    case 'resetEditorMenu':
      return state.menuType != 'tools'
        ? state.previousMenu || state
        : state;
    case 'showOkCancelMenu':
      return {
        menuType: 'okCancel',
        open: true,
        isValid: action.isValid,
        okAction: action.okAction,
        cancelAction: action.cancelAction,
        previousMenu: state
      };
    case 'setOkCancelMenuValid':
      return {
        ...state,
        isValid: action.isValid
      };
    default:
      return state;
  }
}
