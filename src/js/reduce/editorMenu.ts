import {
  Action
} from '../actions';

export interface ContextMenuState {
  readonly menuType : null
  readonly previousMenu : EditorMenuState
}

export interface ToolsMenuState {
  readonly menuType : 'tools'
  readonly open : boolean
}

export interface OkCancelMenuState {
  readonly menuType : 'okCancel'
  readonly open : true
  readonly isValid : boolean
  readonly previousMenu : EditorMenuState
}

export type EditorMenuState = ToolsMenuState | OkCancelMenuState | ContextMenuState;

const initialState : EditorMenuState = {
  open: false,
  menuType: 'tools'
};

export default function editorMenu(state = initialState, action : Action) : EditorMenuState {
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
    case 'resetEditorMenu':
      return state.menuType != 'tools'
        ? state.previousMenu || state
        : state;
    case 'showOkCancelMenu':
      return {
        menuType: 'okCancel',
        open: true,
        isValid: action.isValid,
        previousMenu: state
      };
    case 'setOkCancelMenuValid':
      return state.menuType != 'okCancel'
      ? state
      : {
        ...state,
        isValid: action.isValid
      };
    default:
      return state;
  }
}
