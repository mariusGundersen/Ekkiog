import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import tiles from '../img/tiles.png';
import { ifOnlyWeHadTopLevelAwaitAndNotSyncModules } from './loadImage';
import main from './main';
import reduce, { State } from './reduce';
import sagas from './sagas';
import { Action } from './actions';


ifOnlyWeHadTopLevelAwaitAndNotSyncModules(tiles).then(() => {
  const history = createBrowserHistory()

  const sagaMiddleware = createSagaMiddleware();

  const store = createStore<State, Action, any, any>(
    reduce(history),
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