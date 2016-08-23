import React from 'react';
import reactDom from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import {EventEmitter} from 'events';

import '../css/main.css';
import '../manifest.json';
import offline from 'offline-plugin/runtime';

import Shell from './Shell.js';
import Editor from './editing/Editor.js';
import Storage from './storage/Storage.js';
import Context from './Context.js';
import Renderer from './engines/Renderer.js';
import Perspective from './Perspective.js';
import TouchControls from './interaction/TouchControls.js';

import {
  toEmitterMiddleware,
  fromEmitter
} from './emitterRedux.js';

import {
  resize,
  panZoom
} from './actions.js';

import reducers from './reducers.js';
import App from './components/App.jsx';

const TILE_SIZE = 16;

if(!__DEV__) offline.install();

const emitter = new EventEmitter();

const store = createStore(reducers, {
  global: { emitter }
}, applyMiddleware(toEmitterMiddleware(emitter)));

initialize(store, ({global}) => {
  const gl = global.gl;

  const renderer = new Renderer(gl);
  const touchControls = new TouchControls(emitter);

  const perspective = new Perspective();
  const context = new Context(gl, {width: 128, height: 128}, TILE_SIZE);
  perspective.setMapSize(context.width, context.height);

  const storage = new Storage();
  context.import(storage.load());
  renderer.renderMap(context);

  const editor = new Editor(context);

  fromEmitter(emitter, editor, perspective, context, renderer, storage, store);

  const shell = new Shell({
    tickInterval: 500,
    tick(tickCount) {
      //engineStats.begin();
      renderer.simulateTick(context, tickCount);
      //engineStats.end();
    },

    render() {
      //viewStats.begin();
      const result = touchControls.panZoomSaga.process();
      if(result !== null){
        perspective.panZoom(result.previous, result.current);
        store.dispatch(panZoom(perspective.tileToViewportMatrix));
      }
      renderer.renderView(context, perspective);
      const moveState = store.getState().moveIt;
      if(moveState.move){
        renderer.renderMove(context, perspective, moveState);
      }
      //viewStats.end();
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
      listener(state);
    }
  });
}
