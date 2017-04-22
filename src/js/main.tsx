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
  initialize(store, async ({engine, emitter, perspective} : GlobalStateInitialized) => {
    const touchControls = new TouchControls(emitter, perspective);

    storage.load('Welcome').then(forest => store.dispatch(setForest(forest.name, forest)));

    fromEmitter(emitter, (x, y) => perspective.viewportToTile(x, y), store.dispatch, () => store.getState());

    const shellConfig = startShell({
      tickInterval: 500,
      tick(tickCount) {
        engine.simulate(tickCount);
      },

      render() {
        const state = store.getState();
        const changed = touchControls.panZoomSaga.process();
        if(changed){
          store.dispatch(panZoom(perspective.tileToViewport.bind(perspective)));
        }

        engine.render(perspective.mapToViewportMatrix);

        if(state.selection.selection){
          engine.renderMove(
            perspective.mapToViewportMatrix,
            state.selection,
            state.selection.dx,
            state.selection.dy);
        }
      },

      resize(pixelWidth, pixelHeight) {
        store.dispatch(resize(pixelWidth, pixelHeight));
        const prevWidth = perspective.viewportWidth;
        const mapPosA = perspective.viewportToMap(0, 0);
        const mapPosB = perspective.viewportToMap(prevWidth, 0);
        perspective.setViewport(pixelWidth, pixelHeight);
        const squarePosA = perspective.viewportToSquare(0, 0);
        const squarePosB = perspective.viewportToSquare(pixelWidth, 0);

        perspective.transformMapToSquare(
          [mapPosA, squarePosA],
          [mapPosB, squarePosB]);

        store.dispatch(panZoom(perspective.tileToViewport.bind(perspective)));
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