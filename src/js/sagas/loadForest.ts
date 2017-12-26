import { put } from 'redux-saga/effects';

import { forestLoaded, newContextLoading, LoadForestAction } from '../actions';
import * as storage from '../storage';
import { createForest } from 'ekkiog-editing';
import setUrl from '../actions/router';

export default function* loadForest({repo, name, version} : LoadForestAction) {
  yield put(newContextLoading(repo, name, version));
  const component = yield* loadOrCreate(repo, name, version);
  yield put(setUrl(repo, name));
  yield put(forestLoaded(component, component.hash));
};

export function* loadOrCreate(repo : string, name : string, version : string){
  try{
    return yield storage.load(repo, name, version);
  }catch(e){
    if(repo.length === 0){
      return {
        ...createForest(),
        hash: '0000000000000000000000000000000000000000'
      };
    }else{
      try{
        yield storage.fetch(repo, name).catch(e => console.log(e));
        return yield storage.load(repo, name, version);
      }catch(e){
        console.log(e);
        return {
          ...createForest(),
          hash: '0000000000000000000000000000000000000000'
        };
      }
    }
  }
}
