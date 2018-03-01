import { put, take, call } from 'redux-saga/effects';
import Terminal from '@es-git/terminal';

import { forestLoaded, newContextLoading, LoadForestAction, abortContextLoading, showPopup, hidePopup, gitProgressStatus, gitProgressMessage } from '../actions';
import * as storage from '../storage';
import { createForest } from 'ekkiog-editing';
import setUrl from '../actions/router';
import { eventChannel, delay } from 'redux-saga';
import withProgress from './utils/withProgress';

export default function* loadForest({repo, name, hash} : LoadForestAction) {
  try{
    yield put(newContextLoading(repo, name));
    const component = yield* loadOrCreate(repo, name, hash);
    yield put(setUrl(repo, name));
    yield put(forestLoaded(component, component.hash, repo.length > 0));
  }catch(e){
    console.log(e);
    yield put(abortContextLoading());
  }
};

export function* loadOrCreate(repo : string, name : string, hash? : string){
  if(repo.length === 0){
    try{
      return yield* loadOrPull(repo, name, hash);
    }catch(e){
      console.log(e);
      const forest = createForest();
      const hash = yield storage.save(name, forest, `Created ${name}`);
      return {
        ...forest,
        hash
      };
    }
  }else{
    return yield* loadOrPull(repo, name, hash);
  }
}

export function* loadOrPull(repo : string, name : string, hash? : string){
  if(repo.length === 0){
    return yield storage.load(repo, name, hash);
  }else{
    try{
      return yield storage.load(repo, name, hash);
    }catch(e){
      return yield* pull(repo, name, hash);
    }
  }
}

function* pull(repo : string, name : string, hash? : string){
  var terminal = new Terminal();
  try{
    yield put(gitProgressStatus('busy'));
    yield put(gitProgressMessage(terminal.logLine(`Loading ${name}\nfrom ${repo}`)));
    yield put(showPopup('GitProgress'));
    yield* fetchWithProgress(repo, name, terminal);
    yield put(gitProgressStatus('success'));
    yield put(hidePopup());
    return yield storage.load(repo, name, hash);
  }catch(e){
    terminal.logLine();
    yield put(gitProgressStatus('failure'));
    yield put(gitProgressMessage(terminal.log(e.message)));
    throw e;
  }
}

function* fetchWithProgress(repo : string, name : string, terminal : Terminal){
  const result : {name : string}[] = yield* withProgress(terminal, emit => storage.fetchComponent(repo, name, emit));

  if(result.some(r => r.name === name)){
    return;
  }else{
    throw new Error(`Could not find ${name}\nin ${repo}`);
  }
}