import { combineReducers } from 'redux';

import view from './reducers/view.js';
import global from './reducers/global.js';
import editor from './reducers/editor.js';
import editorMenu from './reducers/editorMenu.js';
import contextMenu from './reducers/contextMenu.js';
import forest from './editing/reduce';
import selection from './reducers/selection.js';

import { Storage } from './storage/database';

export default (database : Storage) => combineReducers({
  view,
  global: global(database),
  editor,
  editorMenu,
  contextMenu,
  forest,
  selection
});
