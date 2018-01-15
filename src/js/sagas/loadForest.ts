import { put } from 'redux-saga/effects';

import { forestLoaded, newContextLoading, LoadForestAction, abortContextLoading } from '../actions';
import * as storage from '../storage';
import { createForest } from 'ekkiog-editing';
import setUrl from '../actions/router';

export default function* loadForest({repo, name, version} : LoadForestAction) {
  yield put(newContextLoading(repo, name, version));
  try{
    const component = yield* loadOrCreate(repo, name, version);
    yield put(setUrl(repo, name));
    yield put(forestLoaded(component, component.hash));
  }catch(e){
    yield put(abortContextLoading());
  }
};

export function* loadOrCreate(repo : string, name : string, version : string){
  if(repo.length === 0){
    try{
      yield* loadOrPull(repo, name, version);
    }catch(e){
      return {
        ...createForest(),
        hash: '0000000000000000000000000000000000000000'
      };
    }
  }else{
    yield* loadOrPull(repo, name, version);
  }
}

export function* loadOrPull(repo : string, name : string, version : string){
  if(repo.length === 0){
    return yield storage.load(repo, name, version);
  }else{
    try{
      return yield storage.load(repo, name, version);
    }catch(e){
      yield storage.fetch(repo, name).catch(e => console.log(e));
      return yield storage.load(repo, name, version);
    }
  }
}