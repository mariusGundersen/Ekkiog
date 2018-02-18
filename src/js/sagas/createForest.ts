import { put } from 'redux-saga/effects';

import { forestLoaded, newContextLoading, CreateForestAction } from '../actions';
import * as storage from '../storage';
import { createForest } from 'ekkiog-editing';
import setUrl from '../actions/router';

export default function* create({name} : CreateForestAction) {
  yield put(newContextLoading('', name));
  const hash = yield storage.save(name, createForest(), `Created ${name}`);
  yield put(forestLoaded(createForest(), hash));
  yield put(setUrl('', name));
};