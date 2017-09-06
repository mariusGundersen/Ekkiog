import { combineReducers } from 'redux';

import view, { ViewState } from './reducers/view';
import editor, { EditorState } from './reducers/editor';
import editorMenu, { EditorMenuState } from './reducers/editorMenu';
import contextMenu, { ContextMenuState } from './reducers/contextMenu';
import context, { ContextState } from './reducers/context';
import selection, { SelectionState } from './reducers/selection';
import simulation, { SimulationState } from './reducers/simulation';

export interface State {
  readonly view : ViewState,
  readonly editor : EditorState,
  readonly editorMenu : EditorMenuState,
  readonly contextMenu : ContextMenuState,
  readonly context : ContextState | null,
  readonly selection : SelectionState,
  readonly simulation : SimulationState
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
