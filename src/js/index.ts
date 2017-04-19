import * as React from 'react';
import * as reactDom from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, Store } from 'redux';
import thunk from 'redux-thunk';

import '../css/main.css';
import '../manifest.json';

import offline from './offline';

import { createEmitterMiddleware } from './emitterRedux';
import createContextMiddleware from './editing/createContextMiddleware';
import reduce, { State } from './reduce';

import main from './main';

offline();

const store = createStore<State>(
  reduce,
  applyMiddleware(
    thunk,
    createEmitterMiddleware(),
    createContextMiddleware()
  )
);

main(store);