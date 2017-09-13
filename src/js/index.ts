import * as React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk';

import '../css/main.css';
import '../manifest.json';
import tiles from '../img/tiles.png';

import offline from './offline';
import reduce, { State } from './reduce';
import { PageState } from './reduce/page';
import { loadForest } from './actions';
import sagas from './sagas';

import main from './main';
import { ifOnlyWeHadTopLevelAwaitAndNotSyncModules } from './loadImage';

if('asyncIterator' in Symbol === false){
  (Symbol as any).asyncIterator = Symbol();
}

ifOnlyWeHadTopLevelAwaitAndNotSyncModules(tiles).then(() => {

  offline();

  const sagaMiddleware = createSagaMiddleware();

  const store = createStore<State>(
    reduce,
    {
      page: pageFromUrl()
    } as any,
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(
      applyMiddleware(
        thunk,
        sagaMiddleware
      )
    )
  );

  sagaMiddleware.run(sagas)

  main(store);

  const search = new URLSearchParams(document.location.search);
  store.dispatch(loadForest(
    search.get('repo') || '',
    search.get('component') || 'WELCOME',
    search.get('version') || '0'));

  function pageFromUrl() : PageState {
    const search = new URLSearchParams(document.location.search);
    if(search.get('demo')){
      return {
        name: 'demo'
      }
    }

    return {
      name: 'edit'
    }
  }
});