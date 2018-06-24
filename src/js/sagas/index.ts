import { all, takeLatest, take, put } from 'redux-saga/effects';
import insertComponentPackage from './insertComponentPackage';
import zoomOutOf from './zoomOutOf';
import zoomInto from './zoomInto';
import tapTile from './tapTile';
import loadForest from './loadForest';
import moveItemAt from './moveItemAt';
import {
  Action,
  DoubleTapTileAction,
  zoomInto as zoomIn,
  zoomOutOf as zoomOut
} from '../actions';
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
    watchLatest('start-sync', sync),
    watchLatest('double-tap-tile', doubleTap)
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

function* doubleTap({x, y}: DoubleTapTileAction){
  if(x < 0 || y < 0 || x > 128 || y > 128){
    yield put(zoomOut());
  }else{
    yield put(zoomIn(x, y));
  }
}