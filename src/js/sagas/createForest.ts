import { put } from 'redux-saga/effects';

import { forestLoaded, newContextLoading, CreateForestAction } from '../actions';
import * as storage from '../storage';
import { createForest } from '../editing';
import setUrl from '../actions/router';

export default function* create({name} : CreateForestAction) {
  yield put(newContextLoading('', name));
  const forest = createForest();
  const hash = yield storage.create(name, forest);
  yield put(forestLoaded(createForest(), hash, false));
  yield put(setUrl('', name));
};