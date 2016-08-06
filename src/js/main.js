import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import '../css/main.css';
import '../manifest.json';
import offline from 'offline-plugin/runtime';

import Shell from './Shell.js';
import Editor from './editing/Editor.js';
import Storage from './storage/Storage.js';
import Context from './Context.js';
import Renderer from './Renderer.js';
import Perspective from './Perspective.js';
import TouchControls from './interaction/TouchControls.js';

import {
  RESIZE
} from './actions.js';
import reducers from './reducers.js';
import App from './components/App.jsx';

const TILE_SIZE = 16;

if(!__DEV__) offline.install();

const store = createStore(reducers);
initialize(store, ({global}) => {
  const gl = global.gl;

  const renderer = new Renderer(gl);
  const touchControls = new TouchControls(global.emitter);

  const perspective = new Perspective();
  const context = new Context(gl, {width: 128, height: 128}, TILE_SIZE);
  perspective.setMapSize(context.width, context.height);

  const storage = new Storage();
  context.import(storage.load());
  renderer.renderMap(context);

  const editor = new Editor(context);

  global.emitter.on('tap', ({x, y}) => {
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

  global.emitter.on('longPress', ({x, y}) => {
    const [tx, ty] = perspective.viewportToTile(x, y);

    window.requestAnimationFrame(() => {
      if(editor.longPress(tx, ty)){
        context.mapTexture.update();
        context.netMapTexture.update();
        context.gatesTexture.update();

        renderer.renderMap(context);

        storage.save(context.export());
      }
    });
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
      touchControls.panZoom(perspective);
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