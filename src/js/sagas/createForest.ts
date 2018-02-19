import { put } from 'redux-saga/effects';

import { forestLoaded, newContextLoading, CreateForestAction } from '../actions';
import * as storage from '../storage';
import { createForest } from 'ekkiog-editing';
import setUrl from '../actions/router';

export default function* create({name} : CreateForestAction) {
  yield put(newContextLoading('', name));
  const forest = createForest();
  const hash = yield storage.save(name, forest, `Created ${name}`);
  yield put(forestLoaded(createForest(), hash, false));
  yield put(setUrl('', name));
};