import React from 'react';
import reactDom from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import '../css/main.css';
import '../manifest.json';
import offline from 'offline-plugin/runtime';

import Shell from './Shell.js';
import {open as openDatabase} from './storage/database.js';
import TouchControls from './interaction/TouchControls.js';

import {
  createEmitterMiddleware,
  fromEmitter
} from './emitterRedux.js';

import createContextMiddleware from './editing/createContextMiddleware';

import {
  resize,
  panZoom,
  loadComponent
} from './actions.js';

import createReduce from './reduce.js';
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

openDatabase().then(database => {
  const store = createStore(
    createReduce(database),
    applyMiddleware(
      thunk,
      createEmitterMiddleware(),
      createContextMiddleware()
    )
  );

  initialize(store, async ({gl, renderer, context, selectionContext, emitter, perspective}) => {
    perspective.setMapSize(context.width, context.height);

    const touchControls = new TouchControls(emitter, (x, y) => perspective.viewportToTile(x, y));

    store.dispatch(loadComponent('Welcome'));

    fromEmitter(emitter, (x, y) => perspective.viewportToTile(x, y), () => store.getState(), store.dispatch);

    context.spriteSheetTexture.loading.then(t => {
      context.wordQuadList.set(0, {
        pos: {x:24, y:28, w:7, h:8},
        uv: {x:7, y:248, w:7, h:8}
      });
      context.wordQuadList.set(1, {
        pos: {x:32, y:28, w:7, h:8},
        uv: {x:0, y:248, w:7, h:8}
      });
      context.wordQuadList.update(2);
      renderer.renderWord(context);
    });

    const shell = new Shell({
      tickInterval: 500,
      tick(tickCount) {
        renderer.simulateTick(context, tickCount);
      },

      render() {
        const state = store.getState();
        const result = touchControls.panZoomSaga.process();
        if(result !== null){
          perspective.panZoom(result.previous, result.current);
          store.dispatch(panZoom(perspective.tileToViewportMatrix, perspective.viewportToTileMatrix));
        }

        renderer.renderView(
          context,
          perspective.mapToViewportMatrix,
          perspective.viewportSize);

        if(state.selection.selection){
          renderer.renderMove(
            selectionContext,
            perspective.mapToViewportMatrix,
            state.selection,
            state.selection.dx,
            state.selection.dy);
        }
      },

      resize(pixelWidth, pixelHeight, screenWidth, screenHeight) {
        store.dispatch(resize(pixelWidth, pixelHeight, screenWidth, screenHeight));
        const prevWidth = perspective.viewportWidth;
        perspective.setViewport(pixelWidth, pixelHeight);
        perspective.scaleBy(prevWidth/pixelWidth)
        store.dispatch(panZoom(perspective.tileToViewportMatrix, perspective.viewportToTileMatrix));
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
