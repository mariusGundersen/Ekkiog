import { put } from 'redux-saga/effects';

import { forestLoaded, newContextLoading, LoadForestAction } from '../actions';
import * as storage from '../storage';

export default function* loadForest({repo, name, version} : LoadForestAction) {
  yield put(newContextLoading(repo, name, version));
  const component = yield storage.load(name);
  yield put(forestLoaded(component, component.hash));
};