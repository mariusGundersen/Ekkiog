import { combineReducers } from 'redux';

import view from './reducers/view.js';
import global from './reducers/global.js';
import editor from './reducers/editor.js';
import mainMenu from './reducers/mainMenu.js';
import contextMenu from './reducers/contextMenu.js';
import forest from './editing/reduce.js';
import selection from './reducers/selection.js';

export default database => combineReducers({
  view,
  global: global(database),
  editor,
  mainMenu,
  contextMenu,
  forest,
  selection
});
