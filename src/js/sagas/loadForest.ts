import { put } from 'redux-saga/effects';
import Terminal from '@es-git/terminal';

import { forestLoaded, newContextLoading, LoadForestAction, abortContextLoading, showPopup, hidePopup, gitProgressStatus, gitProgressMessage } from '../actions';
import * as storage from '../storage';
import { createForest } from '../editing';
import setUrl from '../actions/router';
import withProgress from './utils/withProgress';
import { ForestWithHash } from '../storage/loadForest';

export default function* loadForest({ repo, name, hash }: LoadForestAction) {
  try {
    yield put(newContextLoading(repo, name));
    const component: ForestWithHash = yield* loadOrCreate(repo, name, hash);
    yield put(setUrl(repo, name));
    yield put(forestLoaded(component, component.hash, repo.length > 0 || component.testScenario !== undefined));
  } catch (e) {
    console.log(e);
    yield put(abortContextLoading());
  }
};

export function* loadOrCreate(repo: string, name: string, hash?: string) {
  if (repo.length === 0) {
    try {
      return yield* loadOrPull(repo, name, hash);
    } catch (e) {
      console.log(e);
      const forest = createForest();
      const hash = yield storage.create(name, forest);
      return {
        ...forest,
        hash
      };
    }
  } else {
    return yield* loadOrPull(repo, name, hash);
  }
}

export function* loadOrPull(repo: string, name: string, hash?: string) {
  if (repo.length === 0) {
    return yield storage.load(repo, name, hash);
  } else {
    try {
      return yield storage.load(repo, name, hash);
    } catch (e) {
      return yield* pull(repo, name, hash);
    }
  }
}

function* pull(repo: string, name: string, hash?: string) {
  var terminal = new Terminal();
  try {
    yield put(gitProgressStatus('busy'));
    yield put(gitProgressMessage(terminal.logLine(`Loading ${name}\nfrom ${repo}`)));
    yield put(showPopup('GitProgress'));
    yield* fetchWithProgress(repo, name, hash, terminal);
    yield put(gitProgressStatus('success'));
    yield put(hidePopup());
    return yield storage.load(repo, name, hash);
  } catch (e) {
    terminal.logLine();
    yield put(gitProgressStatus('failure'));
    yield put(gitProgressMessage(terminal.log(e.message)));
    throw e;
  }
}

function* fetchWithProgress(repo: string, name: string, hash: string | undefined, terminal: Terminal) {
  const result: boolean = yield* withProgress(terminal, emit => storage.fetchComponent(repo, name, hash, emit));

  if (result) {
    return;
  } else {
    throw new Error(`Could not find ${name}\nin ${repo}`);
  }
}