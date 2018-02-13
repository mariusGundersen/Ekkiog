import * as storage from '../../storage';
import { Repo } from '../../storage';
import findCommonCommits, { HashAndCommit, CommitWithParents } from '@es-git/push-mixin/es/findCommonCommits';
import { put, take, fork, select } from 'redux-saga/effects';
import { syncDone, syncComplete } from './actions';
import Terminal from '@es-git/terminal';
import { syncProgress, SyncComplete } from '../../actions/index';
import { eventChannel } from 'redux-saga';
import { State } from '../../reduce/index';

export default function* syncSaga(){
  const user = storage.user as OauthData;
  const repo : Repo = yield storage.repo;
  yield* fetch();
  const allRefs : string[] = yield repo.listRefs();
  const localRefs : RefStatus[] = yield Promise.all(allRefs.filter(r => r.startsWith('refs/heads/')).map(getRef(repo, 'local', 11)));
  const remoteRefs : RefStatus[] = yield Promise.all(allRefs.filter(r => r.startsWith('refs/remotes/origin/')).map(getRef(repo, 'remote', 20)));
  const refs = join(localRefs, remoteRefs);

  const list : NameAndType[] = yield Promise.all(refs.map(async ref => ({
      name: ref.name,
      type: ref.local === ref.remote ? 'ok' :
            !ref.local ? 'behind' :
            !ref.remote ? 'infront' :
            await walk(ref.local, ref.remote, repo)
  })));

  yield put(syncDone(
    list.filter(r => r.type === 'ok').map(r => r.name),
    list.filter(r => r.type === 'behind').map(r => r.name),
    list.filter(r => r.type === 'infront').map(r => r.name),
    list.filter(r => r.type === 'diverged').map(r => r.name)
  ));

  yield take('sync-go');
  console.log('start-sync');

  const state : State = yield select();
  console.log(state.sync);
  if(state.sync.state !== 'done') return;

  yield put(syncProgress(''));

  const toPull = state.sync.behind
    .concat(state.sync.diverged)
    .filter(x => x.action === 'pull')
    .map(x => x.name);

    const toPush = state.sync.infront
    .concat(state.sync.diverged)
    .filter(x => x.action === 'push')
    .map(x => x.name);

  console.log(toPush);

  for(const ref of toPull){
    const hash : string = yield repo.getRef(`refs/remotes/origin/${ref}`);
    yield repo.setRef(`refs/heads/${ref}`, hash);
  }

  yield* push(user, toPush);

  console.log('done');

  yield put(syncComplete());
}

async function walk(local : string, remote : string, repo : Repo){
  const localWalk = repo.walkCommits(local);
  const remoteWalk = repo.walkCommits(remote);
  const common : HashAndCommit<CommitWithParents>[] = await findCommonCommits(localWalk, remoteWalk);
  if(common.length){
    if(common[0].hash === local){
      return 'behind';
    }else if(common[0].hash === remote){
      return 'infront';
    }
  }

  return 'diverged';
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
    yield* withProgress(terminal, emit => storage.fetch(emit));
  }catch(e){
    terminal.logLine();
    yield put(syncProgress(terminal.log(e.message)));
    throw e;
  }
}

function* push(user : OauthData, components : string[]){
  var terminal = new Terminal();
  try{
    yield put(syncProgress(terminal.logLine(`Pushing...`)));
    yield* withProgress(terminal, emit => storage.push(user, components, emit));
  }catch(e){
    terminal.logLine();
    yield put(syncProgress(terminal.log(e.message)));
    throw e;
  }
}

type StringOrResult = string | {name : string}[];

function* withProgress(terminal : Terminal, start : (emit : (v : any) => void) => Promise<any>){
  const channel = yield eventChannel(emit => {
    start(emit).then(emit, emit);
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

interface NameAndType {
  readonly name : string
  readonly type : 'ok' | 'infront' | 'behind' | 'diverged'
}