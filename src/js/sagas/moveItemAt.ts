import { put, select } from 'redux-saga/effects';
import { getTileAt } from 'ekkiog-editing';

import {
  MoveItemAtAction,
  removeTileAt,
  saveForest,
  setForest,
} from '../actions';
import { State } from '../reduce';
import selection from './selection';

export default function* moveItemAt({tx, ty} : MoveItemAtAction){
  const {context: {forest: initialForest}} : State = yield select();

  const item = getTileAt(initialForest, tx, ty);
  yield put(removeTileAt(tx, ty));

  const ok = yield* selection(item);
  if(ok) {
    yield put(saveForest(`Moved ${item.data.type}`));
  } else {
    yield put(setForest(initialForest));
  }
};

