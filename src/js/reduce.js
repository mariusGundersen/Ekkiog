import { combineReducers } from 'redux';

import view from './reducers/view.js';
import global from './reducers/global.js';
import editor from './reducers/editor.js';
import mainMenu from './reducers/mainMenu.js';
import contextMenu from './reducers/contextMenu.js';
import forest from './editing/reduce.js';
import search from './reducers/search.js';

const reduce = combineReducers({
  view,
  global,
  editor,
  mainMenu,
  contextMenu,
  forest,
  search
});

export default reduce;
