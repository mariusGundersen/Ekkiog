import { combineReducers } from 'redux';
import { routerReducer, RouterState as ReactRouterState } from 'react-router-redux';

import context, { ContextState } from './context';
import contextMenu, { ContextMenuState } from './contextMenu';
import editor, { EditorState } from './editor';
import editorMenu, { EditorMenuState } from './editorMenu';
import selection, { SelectionState } from './selection';
import simulation, { SimulationState } from './simulation';
import view, { ViewState } from './view';
import { matchPath } from 'react-router';

export interface RouterState extends ReactRouterState {
  readonly isReadOnly : boolean
}

export interface State {
  readonly context : ContextState,
  readonly contextMenu : ContextMenuState,
  readonly editor : EditorState,
  readonly editorMenu : EditorMenuState,
  readonly router : RouterState,
  readonly selection : SelectionState,
  readonly simulation : SimulationState
  readonly view : ViewState,
}

export default combineReducers<State>({
  context,
  contextMenu,
  editor,
  editorMenu,
  router,
  selection,
  simulation,
  view
});

function router(state : RouterState, action : any) : RouterState {
  const nextState = routerReducer(state, action);
  if(nextState === state) return state;

  if(!nextState.location){
    return {
      ...nextState,
      isReadOnly: true
    };
  }

  const match = matchPath(nextState.location.pathname, { path: '/demo' });
  return {
    ...nextState,
    isReadOnly: match ? true : false
  };
}