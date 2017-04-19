import * as React from 'react';
import * as reactDom from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'redux';

import startShell from './shell';
import storage from './storage';
import TouchControls from './interaction/TouchControls';

import { fromEmitter } from './emitterRedux';

import {
  resize,
  panZoom,
  setForest
} from './actions';

import { GlobalState, GlobalStateInitialized } from './reducers/global';
import { State } from './reduce';
import App from './components/App';

export default function main(store : Store<State>){
  initialize(store, async ({gl, renderer, context, selectionContext, emitter, perspective} : GlobalStateInitialized) => {
    perspective.setMapSize(context.width, context.height);

    const touchControls = new TouchControls(emitter, (x, y) => perspective.viewportToTile(x, y));

    storage.load('Welcome').then(forest => store.dispatch(setForest(forest.name, forest)));

    fromEmitter(emitter, (x, y) => perspective.viewportToTile(x, y), store.dispatch, () => store.getState());

    const shellConfig = startShell({
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

  function initialize(store : Store<State>, listener : (global : GlobalStateInitialized) => Promise<void>){
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      if(state.global.initialized){
        unsubscribe();
        listener(state.global).catch(e => console.error(e));
      }
    });
  }
}