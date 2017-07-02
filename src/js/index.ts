import * as React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import '../css/main.css';
import '../manifest.json';

import offline from './offline';
import storage from './storage';
import createContextMiddleware from './editing/createContextMiddleware';
import reduce, { State } from './reduce';
import { setForest } from './actions';

import main from './main';

offline();

const store = createStore<State>(
  reduce,
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(
    applyMiddleware(
      thunk,
      createContextMiddleware()
    )
  )
);

storage.load('Welcome').then(forest => store.dispatch(setForest(forest.name, forest)));

main(store);