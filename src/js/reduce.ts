import { combineReducers } from 'redux';

import view, { ViewState } from './reducers/view';
import editor, { EditorState } from './reducers/editor';
import editorMenu, { EditorMenuState } from './reducers/editorMenu';
import contextMenu, { ContextMenuState } from './reducers/contextMenu';
import context, { ContextState } from './reducers/context';
import selection, { SelectionState } from './reducers/selection';
import simulation, { SimulationState } from './reducers/simulation';

export interface State {
  view : ViewState,
  editor : EditorState,
  editorMenu : EditorMenuState,
  contextMenu : ContextMenuState,
  context : ContextState,
  selection : SelectionState,
  simulation : SimulationState
}

export default combineReducers<State>({
  view,
  editor,
  editorMenu,
  contextMenu,
  context,
  selection,
  simulation
});
