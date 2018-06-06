import { combineReducers, Reducer } from 'redux';

import context, { ContextState } from './context';
import contextMenu, { ContextMenuState } from './contextMenu';
import editor, { EditorState } from './editor';
import editorMenu, { EditorMenuState } from './editorMenu';
import popup, { PopupState } from './popup';
import router, { RouterState } from './router';
import selection, { SelectionState } from './selection';
import simulation, { SimulationState } from './simulation';
import view, { ViewState } from './view';
import gitPopup, { GitPopupState } from '../features/gitPopup/reduce';
import sync, { SyncState } from '../features/sync/reduce';
import user from './user';
import { Action } from '../actions';

export interface State {
  readonly context : ContextState,
  readonly contextMenu : ContextMenuState,
  readonly editor : EditorState,
  readonly editorMenu : EditorMenuState,
  readonly popup : PopupState,
  readonly router : RouterState,
  readonly selection : SelectionState,
  readonly simulation : SimulationState
  readonly view : ViewState,
  readonly gitPopup : GitPopupState,
  readonly sync : SyncState
  readonly user : OauthData | null
}

export default abortTapMiddleware(combineReducers<State>({
  context,
  contextMenu,
  editor,
  editorMenu,
  router,
  popup,
  selection,
  simulation,
  view,
  gitPopup,
  sync,
  user
}));

function abortTapMiddleware(reduce : Reducer<State, Action>) : Reducer<State, Action>{
  let tempState : State | undefined = undefined;
  let tappedAt = 0;
  return (state : State | undefined, action : Action) => {
    if(action.type === 'tap-tile'){
      tempState = state;
      tappedAt = window.performance.now();
    }else if(tempState){
      const now = window.performance.now();
      if(action.type === 'zoom-into' && now - tappedAt < 500){
        state = tempState
        tempState = undefined;
      }else if(now - tappedAt > 500){
        tempState = undefined;
      }
    }
    return reduce(state, action);
  }
}