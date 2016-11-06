import React from 'react';
import reactDom from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import {EventEmitter} from 'events';

import '../css/main.css';
import '../manifest.json';
import offline from 'offline-plugin/runtime';

import Shell from './Shell.js';
import Editor from './editing/Editor.js';
import * as database from './storage/database.js';
import Context from './Context.js';
import Renderer from './engines/Renderer.js';
import Perspective from './Perspective.js';
import TouchControls from './interaction/TouchControls.js';

import {
  createEmitterMiddleware,
  fromEmitter
} from './emitterRedux.js';

import createContextMiddleware from './editing/createContextMiddleware.js';

import {
  resize,
  panZoom
} from './actions.js';

import reducers from './reducers.js';
import App from './components/App.jsx';

const MAP_SIZE = 128;
const TILE_SIZE = 16;

if(!__DEV__){
  offline.install({
    onInstalled: () => {
      //console.log('installed');
    },
    onUpdating: () => {
      //console.log('updating');
    },
    onUpdateReady: () => {
      //console.log('ready');
      offline.applyUpdate();
    }
  });
}

const emitter = new EventEmitter();
const world = {
  context: null,
  renderer: null
};

const store = createStore(
  reducers,
  applyMiddleware(
    createEmitterMiddleware(emitter),
    createContextMiddleware(world)
  )
);

initialize(store, async ({global}) => {
  const gl = global.gl;

  const renderer = new Renderer(gl);
  const context = new Context(gl, MAP_SIZE, TILE_SIZE);
  world.context = context;
  world.renderer = renderer;

  const perspective = new Perspective();
  perspective.setMapSize(context.width, context.height);

  const touchControls = new TouchControls(emitter, perspective);

  const storage = await database.open();
  //context.import(await storage.load());
  //renderer.renderMap(context);

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

function initialize(store, listener){
  const unsubscribe = store.subscribe(() => {
    const state = store.getState();
    const gl = state.global.gl;
    if(gl != null){
      unsubscribe();
      listener(state).catch(e => console.error(e));
    }
  });
}
