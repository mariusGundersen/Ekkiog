import React from 'react';
import { render } from 'react-dom';
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
import Renderer from './Renderer.js';
import toEmitter from './toEmitter.js';
import Perspective from './Perspective.js';
import TouchControls from './interaction/TouchControls.js';

import {
  RESIZE,
  START_LONG_PRESS,
  SHOW_CONTEXT_MENU,
  CANCEL_LONG_PRESS,
  PAN_ZOOM,
  hideContextMenu
} from './actions.js';
import reducers from './reducers.js';
import App from './components/App.jsx';

const TILE_SIZE = 16;

if(!__DEV__) offline.install();

const emitter = new EventEmitter();

const store = createStore(reducers, {
  global: { emitter }
}, applyMiddleware(toEmitter(emitter)));
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

  emitter.on('tap', ({x, y}) => {
    const [tx, ty] = perspective.viewportToTile(x, y);

    window.requestAnimationFrame(() => {
      if(editor.query.isButton(tx, ty)){
        editor.toggleButton(tx, ty);

        context.gatesTexture.update();

        renderer.simulateTick(context, renderer.currentTick);

        storage.save(context.export());
      }else{
        const tool = store.getState().editor.selectedTool;
        if(editor.edit(tx, ty, tool)){
          context.mapTexture.update();
          context.netMapTexture.update();
          context.gatesTexture.update();

          renderer.renderMap(context);

          storage.save(context.export());
        }
      }
    });
  });

  emitter.on('potentialLongPress', ({x, y}) => {
    console.log('load', x, y);
    store.dispatch({
      type: START_LONG_PRESS,
      x: x/window.devicePixelRatio,
      y: y/window.devicePixelRatio
    });
  });

  emitter.on('potentialLongPressCancel', ({x, y}) => {
    store.dispatch({
      type: CANCEL_LONG_PRESS,
      x: x/window.devicePixelRatio,
      y: y/window.devicePixelRatio
    });
  });

  emitter.on('longPress', ({x, y}) => {
    const [tx, ty] = perspective.viewportToTile(x, y);
    store.dispatch({
      type: SHOW_CONTEXT_MENU,
      x: x/window.devicePixelRatio,
      y: y/window.devicePixelRatio,
      tx,
      ty
    });
  });

  emitter.on('removeTileAt', ({x, y}) => {
    if(editor.clear(x, y)){
      context.mapTexture.update();
      context.netMapTexture.update();
      context.gatesTexture.update();

      renderer.renderMap(context);

      storage.save(context.export());
    }

    store.dispatch(hideContextMenu());
  });

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
        store.dispatch({
          type: PAN_ZOOM,
          dx: (result.current.x - result.previous.x)/window.devicePixelRatio,
          dy: (result.current.y - result.previous.y)/window.devicePixelRatio
        });
      }
      renderer.renderView(context, perspective);
      //viewStats.end();
    },

    resize(pixelWidth, pixelHeight, screenWidth, screenHeight) {
      store.dispatch({
        type: RESIZE,
        pixelWidth,
        pixelHeight,
        screenWidth,
        screenHeight
      });
      perspective.setViewport(pixelWidth, pixelHeight);
      perspective.scale = context.tileSize * context.width / screenWidth;
    }
  });
});

render(
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