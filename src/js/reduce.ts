import { combineReducers } from 'redux';

import view, { ViewState } from './reducers/view';
import global, { GlobalState } from './reducers/global';
import editor, { EditorState } from './reducers/editor';
import editorMenu, { EditorMenuState } from './reducers/editorMenu';
import contextMenu, { ContextMenuState } from './reducers/contextMenu';
import forest, { Forest } from './editing/reduce';
import selection, { SelectionState } from './reducers/selection';

import { Storage } from './storage/database';

export interface State {
  view : ViewState,
  global : GlobalState,
  editor : EditorState,
  editorMenu : EditorMenuState,
  contextMenu : ContextMenuState,
  forest : Forest,
  selection : SelectionState
}

export default (database : Storage) => combineReducers<State>({
  view,
  global: global(database),
  editor,
  editorMenu,
  contextMenu,
  forest,
  selection
});
