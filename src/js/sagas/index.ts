import { delay } from 'redux-saga';
import { all, takeLatest, take } from 'redux-saga/effects';
import insertComponentPackage from './insertComponentPackage';
import zoomOutOf from './zoomOutOf';
import zoomInto from './zoomInto';
import tapTile from './tapTile';
import loadForest from './loadForest';
import moveItemAt from './moveItemAt';
import { Action } from '../actions';
import save from './save';
import createForest from './createForest';
import sync from '../features/sync/saga';

export default function* rootSaga() {
  yield all([
    watchLatest('load-forest', loadForest),
    watchLatest('create-forest', createForest),
    watchLatest('insert-component-package', insertComponentPackage),
    watchLatest('move-item-at', moveItemAt),
    watchLatest('tap-tile', tapTile),
    watchLatest('save-forest', save),
    watchLatest('zoom-into', zoomInto),
    watchLatest('zoom-out-of', zoomOutOf),
    watch('start-sync', sync)
  ]);
}

function* watch<TAction extends Action>(name : TAction['type'], saga : (action : TAction) => any){
  while(true){
    yield* saga(yield take(name));
  }
}

function* watchLatest<TAction extends Action>(name : TAction['type'], saga : (action : TAction) => any){
  yield takeLatest(name, saga);
}