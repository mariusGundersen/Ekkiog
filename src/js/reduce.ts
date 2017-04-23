import { combineReducers } from 'redux';

import view, { ViewState } from './reducers/view';
import editor, { EditorState } from './reducers/editor';
import editorMenu, { EditorMenuState } from './reducers/editorMenu';
import contextMenu, { ContextMenuState } from './reducers/contextMenu';
import forest, { Forest } from './reducers/forest';
import selection, { SelectionState } from './reducers/selection';
import simulation, { SimulationState } from './reducers/simulation';

export interface State {
  view : ViewState,
  editor : EditorState,
  editorMenu : EditorMenuState,
  contextMenu : ContextMenuState,
  forest : Forest,
  selection : SelectionState,
  simulation : SimulationState
}

export default combineReducers<State>({
  view,
  editor,
  editorMenu,
  contextMenu,
  forest,
  selection,
  simulation
});
