import * as storage from '../../storage';
import { Repo } from '../../storage';
import findCommonCommits, { HashAndCommit, CommitWithParents } from '@es-git/push-mixin/es/findCommonCommits';
import { put, take, fork } from 'redux-saga/effects';
import { syncList, syncStatus } from './actions';
import Terminal from '@es-git/terminal';
import { syncProgress } from '../../actions/index';
import { eventChannel } from 'redux-saga';

export default function* syncSaga(){
  const user = storage.user as OauthData;
  const repo : Repo = yield storage.repo;
  yield* fetch();
  const allRefs : string[] = yield repo.listRefs();
  const localRefs : RefStatus[] = yield Promise.all(allRefs.filter(r => r.startsWith('refs/heads/')).map(getRef(repo, 'local', 11)));
  const remoteRefs : RefStatus[] = yield Promise.all(allRefs.filter(r => r.startsWith('refs/remotes/origin/')).map(getRef(repo, 'remote', 20)));
  const refs = join(localRefs, remoteRefs);
  yield put(syncList(refs.map(r => r.name)));

  for(const ref of refs){
    if(ref.local === ref.remote){;
      yield put(syncStatus(ref.name, 'ok'));
    }else if(!ref.local){
      yield put(syncStatus(ref.name, 'pull'));
    }else if(!ref.remote){
      yield put(syncStatus(ref.name, 'push'));
    }else{
      yield fork(walk, ref.name, ref.local, ref.remote, repo);
    }
  }
}

function* walk(name : string, local : string, remote : string, repo : Repo){
  const localWalk = repo.walkCommits(local);
  const remoteWalk = repo.walkCommits(remote);
  const common : HashAndCommit<CommitWithParents>[] = yield findCommonCommits(localWalk, remoteWalk);
  if(common.length){
    if(common[0].hash === local){
      yield put(syncStatus(name, 'pull'));
    }else if(common[0].hash === remote){
      yield put(syncStatus(name, 'push'));
    }else{
      yield put(syncStatus(name, 'pull-push'));
    }
  }else{
    yield put(syncStatus(name, 'pull-push'));
  }
}

function join(localRefs: RefStatus[], remoteRefs: RefStatus[]) {
  const refMap = new Map(localRefs.map(r => [r.name, r] as [string, RefStatus]));
  for (const remoteRef of remoteRefs) {
    const localRef = refMap.get(remoteRef.name);
    if (localRef) {
      localRef.remote = remoteRef.remote;
    }else{
      refMap.set(remoteRef.name, remoteRef);
    }
  }

  return [...refMap.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function getRef(repo : Repo, key : 'local' | 'remote', trim : number){
  return async (ref : string) : Promise<RefStatus> => {
    const hash = await repo.getRef(ref);
    return {
      name: ref.substr(trim),
      [key]: hash
    }
  }
}

function* fetch(){
  var terminal = new Terminal();
  try{
    yield put(syncProgress(terminal.logLine(`Fetching...`)));
    yield* fetchWithProgress(terminal);
  }catch(e){
    terminal.logLine();
    yield put(syncProgress(terminal.log(e.message)));
    throw e;
  }
}

type StringOrResult = string | {name : string}[];

function* fetchWithProgress(terminal : Terminal){
  const channel = yield eventChannel(emit => {
    storage.fetch(emit).then(emit, emit);
    return () => {};
  });

  while(true){
    const message : StringOrResult = yield take(channel);
    if(typeof(message) === 'string'){
      yield put(syncProgress(terminal.log(message)));
    }else{
      return;
    }
  }
}

interface RefStatus {
  readonly name : string
  local? : string
  remote? : string
}