import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import '../icons/favicon.ico';
import tiles from '../img/tiles.png';
import '../manifest.json';
import { ifOnlyWeHadTopLevelAwaitAndNotSyncModules } from './loadImage';
import main from './main';
import offline from './offline';
import reduce, { State } from './reduce';
import sagas from './sagas';

if('asyncIterator' in Symbol === false){
  (Symbol as any).asyncIterator = Symbol();
}

offline();

ifOnlyWeHadTopLevelAwaitAndNotSyncModules(tiles).then(() => {
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