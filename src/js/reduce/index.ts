import { combineReducers } from 'redux';

import context, { ContextState } from './context';
import contextMenu, { ContextMenuState } from './contextMenu';
import editor, { EditorState } from './editor';
import editorMenu, { EditorMenuState } from './editorMenu';
import popup, { PopupState } from './popup';
import router, { RouterState } from './router';
import selection, { SelectionState } from './selection';
import simulation, { SimulationState } from './simulation';
import view, { ViewState } from './view';

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
}

export default combineReducers<State>({
  context,
  contextMenu,
  editor,
  editorMenu,
  router,
  popup,
  selection,
  simulation,
  view
});