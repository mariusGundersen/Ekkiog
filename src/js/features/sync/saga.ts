import * as storage from '../../storage';
import { put, take, fork, select } from 'redux-saga/effects';
import { syncDone } from './actions';
import Terminal from '@es-git/terminal';
import { gitProgressStatus, gitProgressMessage, showPopup, hidePopup } from '../../actions/index';
import { eventChannel } from 'redux-saga';
import { State } from '../../reduce/index';
import withProgress from '../../sagas/utils/withProgress';

export default function* syncSaga(){
  const { user } : State = yield select();
  if(!user) return;

  yield* fetch();

  yield put(showPopup('Sync'));

  const status = yield storage.status();

  yield put(syncDone(
    status.ok,
    status.behind,
    status.infront,
    status.diverged));

  yield take('sync-go');
  console.log('start-sync');

  const state : State = yield select();
  console.log(state.sync);

  const toPull = state.sync.behind
    .concat(state.sync.diverged)
    .filter(x => x.action === 'pull')
    .map(x => x.name);

    const toPush = state.sync.infront
    .concat(state.sync.diverged)
    .filter(x => x.action === 'push')
    .map(x => x.name);

  yield storage.pull(toPull);

  yield* push(user, toPush);

  console.log('done');
}

function* fetch(){
  var terminal = new Terminal();
  try{
    yield put(gitProgressStatus('busy'));
    yield put(gitProgressMessage(terminal.logLine(`Fetching...`)));
    yield put(showPopup('GitProgress'));
    yield* withProgress(terminal, emit => storage.fetch(emit));
    yield put(gitProgressStatus('success'));
    yield put(hidePopup());
  }catch(e){
    terminal.logLine();
    yield put(gitProgressStatus('failure'));
    yield put(gitProgressMessage(terminal.log(e.message)));
    console.error(e);
  }
}

function* push(user : OauthData, components : string[]){
  var terminal = new Terminal();
  try{
    yield put(gitProgressStatus('busy'));
    yield put(gitProgressMessage(terminal.logLine(`Pushing...`)));
    yield put(showPopup('GitProgress'));
    yield* withProgress(terminal, emit => storage.push(user, components, emit));
    yield put(gitProgressStatus('success'));
    yield put(hidePopup());
  }catch(e){
    terminal.logLine();
    yield put(gitProgressStatus('failure'));
    yield put(gitProgressMessage(terminal.log(e.message)));
    console.error(e);
  }
}
