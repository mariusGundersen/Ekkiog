import { put } from 'redux-saga/effects';

import { forestLoaded, newContextLoading, CreateForestAction } from '../actions';
import * as storage from '../storage';
import { createForest } from 'ekkiog-editing';

export default function* create({name} : CreateForestAction) {
  yield put(newContextLoading('', name));
  yield put(forestLoaded(createForest(), '0000000000000000000000000000000000000000'));
};