import { delay } from 'redux-saga';
import { all, takeLatest } from 'redux-saga/effects';
import insertComponentPackage from './insertComponentPackage';
import doubleTap from './doubleTap';
import tapTile from './tapTile';
import loadForest from './loadForest';
import moveItemAt from './moveItemAt';
import { Action } from '../actions';
import save from './save';


export default function* rootSaga() {
  yield all([
    watchLatest('load-forest', loadForest),
    watchLatest('insert-component-package', insertComponentPackage),
    watchLatest('move-item-at', moveItemAt),
    watchLatest('tap-tile', tapTile),
    watchLatest('save-forest', save),
    watchLatest('double-tap', doubleTap)
  ]);
}


function* watchLatest<TAction extends Action>(name : TAction['type'], saga : (action : TAction) => any){
  yield takeLatest(name, saga);
}