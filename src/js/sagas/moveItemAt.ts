import { createForest } from 'ekkiog-editing';
import { get as getTileAt } from 'ennea-tree';
import { put, select, take } from 'redux-saga/effects';

import {
  insertItem,
  MoveItemAtAction,
  removeTileAt,
  resetEditorMenu,
  saveForest,
  selectItem,
  setForest,
  showOkCancelMenu,
  stopSelection,
} from '../actions';
import copyTo from '../editing/copyTo';
import { State } from '../reduce';

export default function* moveItemAt({tx, ty} : MoveItemAtAction){
  const state : State = yield select();

  const item = getTileAt(state.context.forest.enneaTree, ty, tx);
  yield put(removeTileAt(tx, ty));
  yield put(selectItem(copyTo(createForest(), item.data, item), item));

  yield put(showOkCancelMenu(true));
  const {ok} = yield take('okCancel');
  if(ok) {
    const {selection} : State = yield select();
    if(selection.selection == false) return;
    yield put(insertItem(item.data, {
      left: selection.x + selection.dx,
      top: selection.y + selection.dy,
      width: item.width,
      height: item.height
    }, selection.forest.buddyTree));
    yield put(saveForest(`Moved ${item.data.type}`));
    yield put(stopSelection());
    yield put(resetEditorMenu());
  } else {
    yield put(setForest(state.context.forest));
    yield put(stopSelection());
    yield put(resetEditorMenu());
  }
};