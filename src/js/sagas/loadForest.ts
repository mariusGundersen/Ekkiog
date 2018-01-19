import { put, take, call } from 'redux-saga/effects';
import Terminal from '@es-git/terminal';

import { forestLoaded, newContextLoading, LoadForestAction, abortContextLoading, progressMessage, showPopup, hidePopup } from '../actions';
import * as storage from '../storage';
import { createForest } from 'ekkiog-editing';
import setUrl from '../actions/router';
import { eventChannel, delay } from 'redux-saga';

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
      return yield* loadOrPull(repo, name, version);
    }catch(e){
      return {
        ...createForest(),
        hash: '0000000000000000000000000000000000000000'
      };
    }
  }else{
    return yield* loadOrPull(repo, name, version);
  }
}

export function* loadOrPull(repo : string, name : string, version : string){
  if(repo.length === 0){
    return yield storage.load(repo, name, version);
  }else{
    try{
      return yield storage.load(repo, name, version);
    }catch(e){
      yield put(showPopup('GitProgress'));
      const result : {name : string}[] = yield call(fetchWithProgress, repo, name);
      if(result.some(r => r.name === name)){
        yield put(hidePopup());
        return yield storage.load(repo, name, version);
      }else{
        yield put(progressMessage(`Failed to load ${name}\nfrom ${repo}`))
      }
    }
  }
}


function* fetchWithProgress(repo : string, name : string){
  const channel = yield eventChannel(emit => {
    storage.fetch(repo, name, emit).then(emit);
    return () => {};
  });

  var terminal = new Terminal();

  while(true){
    const message = yield take(channel);
    if(typeof(message) === 'string'){
      console.log(message);
      yield put(progressMessage(terminal.log(message)));
    }else{
      return message;
    }
  }
}