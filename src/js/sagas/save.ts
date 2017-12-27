import { put, select } from 'redux-saga/effects';

import { forestSaved, SaveForestAction, forestSaving } from '../actions';
import { State } from '../reduce';
import * as storage from '../storage';

export default function* save({message} : SaveForestAction){
  const {context: {forest, name}, router} : State = yield select();

  if(router.isReadOnly) return;

  yield put(forestSaving());
  const hash = yield storage.save(name, forest, message);
  yield put(forestSaved(hash));
};