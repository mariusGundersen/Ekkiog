import React from 'react';
import reactDom from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';

import '../css/main.css';
import '../manifest.json';
import offline from 'offline-plugin/runtime';

import Shell from './Shell.js';
import * as database from './storage/database.js';
import TouchControls from './interaction/TouchControls.js';

import {
  createEmitterMiddleware,
  fromEmitter
} from './emitterRedux.js';

import createContextMiddleware from './editing/createContextMiddleware.js';

import {
  resize,
  panZoom,
  setForest
} from './actions.js';

import reduce from './reduce.js';
import App from './components/App.jsx';

if(!__DEV__){
  offline.install({
    onInstalled: () => {
    },
    onUpdating: () => {
    },
    onUpdateReady: () => {
      offline.applyUpdate();
    }
  });
}

database.open().then(storage => {
  const store = createStore(
    reduce,
    applyMiddleware(
      createEmitterMiddleware(),
      createContextMiddleware(storage)
    )
  );

  initialize(store, async ({gl, renderer, context, emitter, perspective}) => {
    perspective.setMapSize(context.width, context.height);

    const touchControls = new TouchControls(emitter, perspective);

    store.dispatch(setForest(await storage.load()));

    fromEmitter(emitter, perspective, store);

    const shell = new Shell({
      tickInterval: 500,
      tick(tickCount) {
        renderer.simulateTick(context, tickCount);
      },

      render() {
        const result = touchControls.panZoomSaga.process();
        if(result !== null){
          perspective.panZoom(result.previous, result.current);
          store.dispatch(panZoom(perspective.tileToViewportMatrix));
        }
        renderer.renderView(context, perspective);
        if(touchControls.selectionSaga.isSelectionActive){
          renderer.renderMove(context, perspective, touchControls.selectionSaga.boundingBox, touchControls.selectionSaga.dx, touchControls.selectionSaga.dy);
        }
      },

      resize(pixelWidth, pixelHeight, screenWidth, screenHeight) {
        store.dispatch(resize(pixelWidth, pixelHeight, screenWidth, screenHeight));
        perspective.setViewport(pixelWidth, pixelHeight);
        perspective.scale = context.tileSize * context.width / screenWidth;
        store.dispatch(panZoom(perspective.tileToViewportMatrix));
      }
    });
  });

  reactDom.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.querySelector('.react-app')
  )
});


function initialize(store, listener){
  const unsubscribe = store.subscribe(() => {
    const state = store.getState();
    if(state.global.gl != null){
      unsubscribe();
      listener(state.global).catch(e => console.error(e));
    }
  });
}
