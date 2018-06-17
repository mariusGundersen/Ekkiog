import { createForest, drawComponent, isEmpty, getTileAt } from 'ekkiog-editing';
import { put, select } from 'redux-saga/effects';

import {
  InsertComponentPackageAction,
  resetEditorMenu,
  saveForest,
  stopSelection,
} from '../actions';
import { State } from '../reduce';
import selection from './selection';

export default function* insertComponentPackage({componentPackage} : InsertComponentPackageAction){
  const state : State = yield select();

  if(state.selection.selection){
    yield put(stopSelection());
    yield put(resetEditorMenu());
  }

  const tile = state.view.viewportToTile(state.view.pixelWidth/2, state.view.pixelHeight/2);
  const centerTile = {
    x: tile[0]|0,
    y: tile[1]|0
  };

  const forest = drawComponent(createForest(state.context.forest.buddyTree), centerTile.x, centerTile.y, componentPackage);

  const item = getTileAt(forest, centerTile.x, centerTile.y);

  const ok = yield* selection(item);
  if(ok){
    yield put(saveForest(`Inserted ${componentPackage.name}`));
  }
}
