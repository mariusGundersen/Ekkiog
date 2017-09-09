import { combineReducers } from 'redux';

import context, { ContextState } from './context';
import contextMenu, { ContextMenuState } from './contextMenu';
import editor, { EditorState } from './editor';
import editorMenu, { EditorMenuState } from './editorMenu';
import page, { PageState } from './page';
import selection, { SelectionState } from './selection';
import simulation, { SimulationState } from './simulation';
import view, { ViewState } from './view';

export interface State {
  readonly context : ContextState,
  readonly contextMenu : ContextMenuState,
  readonly editor : EditorState,
  readonly editorMenu : EditorMenuState,
  readonly page : PageState,
  readonly selection : SelectionState,
  readonly simulation : SimulationState
  readonly view : ViewState,
}

export default combineReducers<State>({
  context,
  contextMenu,
  editor,
  editorMenu,
  page,
  selection,
  simulation,
  view
});
