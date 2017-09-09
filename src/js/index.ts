import * as React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import '../css/main.css';
import '../manifest.json';

import offline from './offline';
import reduce, { State } from './reduce';
import { PageState } from './reduce/page';
import { loadForest } from './actions';

import main from './main';

if('asyncIterator' in Symbol === false){
  (Symbol as any).asyncIterator = Symbol();
}

offline();

const store = createStore<State>(
  reduce,
  {
    page: pageFromUrl()
  } as any,
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(
    applyMiddleware(
      thunk
    )
  )
);

main(store);

const search = new URLSearchParams(document.location.search);
store.dispatch(loadForest(search.get('component') || 'WELCOME'));

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