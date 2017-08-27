import * as React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import '../css/main.css';
import '../manifest.json';

import offline from './offline';
import reduce, { State } from './reduce';
import { loadForest } from './actions';

import main from './main';

offline();

const store = createStore<State>(
  reduce,
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(
    applyMiddleware(
      thunk
    )
  )
);

store.dispatch(loadForest('WELCOME'));

main(store);