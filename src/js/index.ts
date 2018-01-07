import * as React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';

import '../manifest.json';
import tiles from '../img/tiles.png';
import '../icons/favicon.ico';

import offline from './offline';
import reduce, { State } from './reduce';
import sagas from './sagas';

import main from './main';
import { ifOnlyWeHadTopLevelAwaitAndNotSyncModules } from './loadImage';

if('asyncIterator' in Symbol === false){
  (Symbol as any).asyncIterator = Symbol();
}

ifOnlyWeHadTopLevelAwaitAndNotSyncModules(tiles).then(() => {

  offline();

  const history = createHistory()

  const sagaMiddleware = createSagaMiddleware();

  const store = createStore<State>(
    reduce,
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(
      applyMiddleware(
        thunk,
        sagaMiddleware,
        routerMiddleware(history)
      )
    )
  );

  sagaMiddleware.run(sagas)

  main(store, history);
});