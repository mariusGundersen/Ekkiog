import idb, {DB, Transaction, ObjectStore, Cursor} from 'idb';
import { Observable } from 'rxjs/Observable';

import {
  packageComponent,
  createForest,
  Forest,
  CompiledComponent
} from 'ekkiog-editing';

import Repo, { IRepo } from './repo';

import upgradeFrom10 from './upgrade/from10';
import upgradeFrom11 from './upgrade/from11';
import { all } from 'redux-saga/effects';
import findCommonCommits, { HashAndCommit, CommitWithParents } from '@es-git/push-mixin/es/findCommonCommits';

export interface ComponentMetadata {
  readonly repo : string
  readonly name : string
  readonly favorite : boolean
  readonly usedAt : Date
}

export interface RecentComponent {
  readonly repo : string
  readonly name : string
  readonly usedAt : Date
}

export interface FavoriteComponent {
  readonly repo : string
  readonly name : string
}

const THE_YEAR_2000 = new Date(2000, 1);
const THE_YEAR_2100 = new Date(2100, 1);

const _db = idb.open('ekkiog', 12, db => {
  switch(db.oldVersion){
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
      upgradeFrom10(db);
    case 11:
      upgradeFrom11(db);
  }
});

const _repo = _db.then(db => new Repo({}, db));
const user = getUser();

export async function save(name : string, forest : Forest, message : string) : Promise<string> {
  const repo = await _repo;
  const hash = await repo.save(name, forest, message, user);
  await updateRecent('', name);
  return hash;
}

export async function load(repo : string, name : string, hash? : string){

  const result = await _repo.then(r => hash ? r.load(hash) : r.load(repo, name));
  await updateRecent(repo, name);
  return result;
}

async function updateRecent(repo : string, name : string){
  try{
    const db = await _db;
    const transaction = db.transaction([
      'recent',
    ], 'readwrite');
    const recents = transaction.objectStore<RecentComponent>('recent');
    await recents
      .put({
        repo,
        name,
        usedAt: new Date()
      });
  }catch(e){
    console.error(e);
  }
}

export async function loadPackage(repo : string, name : string) : Promise<CompiledComponent>{
  const forest = await load(repo, name);
  return packageComponent(forest, repo, name, forest.hash, forest.hash);
}

export async function getHash(repo : string, name : string) : Promise<string | undefined> {
  return _repo.then(r => r.getHash(repo, name));
}

export function getRecent() : Observable<RecentComponent> {
  return cursorToObservable<RecentComponent>(
    _db,
    'recent',
    (tx, callback) => {
      const store = tx.objectStore<RecentComponent>('recent');
      const index = store.index('usedAt');
      const range = IDBKeyRange.upperBound(THE_YEAR_2100);
      index.iterateCursor(range, 'prev', callback);
    },
    c => c.value);
}

export function getFavorite() : Observable<FavoriteComponent> {
  return cursorToObservable<FavoriteComponent>(
    _db,
    'favorite',
    (tx, callback) => {
      const store = tx.objectStore<FavoriteComponent>('favorite');
      store.iterateCursor(callback);
    },
    c => c.value);
}

export async function toggleFavorite(repo : string, name : string) {
  const db = await _db;
  const tx = db.transaction('favorite', 'readwrite');
  const store = tx.objectStore<FavoriteComponent, [string, string]>('favorite');
  const favorite = await store.get([repo, name]).catch(e => undefined);
  if(favorite){
    const tx = db.transaction('favorite', 'readwrite');
    const store = tx.objectStore<FavoriteComponent, [string, string]>('favorite');
    await store.delete([repo, name]);
  }else{
    const tx = db.transaction('favorite', 'readwrite');
    const store = tx.objectStore<FavoriteComponent, [string, string]>('favorite');
    await store.put({repo, name});
  }
}

export async function getAllComponents() : Promise<ComponentMetadata[]> {
  const repo = await _repo;
  const refs = await repo.listRefs();
  const db = await _db;
  const tx = db.transaction(['favorite', 'recent'], 'readonly');
  const favorites = tx.objectStore<FavoriteComponent, [string, string]>('favorite');
  const recents = tx.objectStore<RecentComponent, [string, string]>('recent');
  return await Promise.all(refs
    .map(refToRepoAndName)
    .filter(data => data.repo !== 'origin')
    .map(async ({name, repo}) => {
      const [favorite, usedAt] = await Promise.all([
        favorites.get([repo, name]).then(x => x ? true : false, () => false),
        recents.get([repo, name]).then(x => x ? x.usedAt : THE_YEAR_2000, () => THE_YEAR_2000)
      ]);
      return {
        name,
        repo,
        favorite,
        usedAt
      }
    }));
}

export async function getOwnedComponents() : Promise<string[]> {
  const repo = await _repo;
  const refs = await repo.listRefs();
  return refs
    .map(refToRepoAndName)
    .filter(data => data.repo !== 'origin')
    .filter(data => data.repo === '')
    .map(data => data.name);
}

function refToRepoAndName(ref : string){
  const [_, type, ...repoAndName] = ref.split('/');
  if(type === 'heads'){
    return {
      repo: '',
      name: repoAndName.join('/')
    }
  } else {
    const [name, ...repo] = repoAndName.reverse();
    return {
      repo: repo.reverse().join('/'),
      name
    }
  }
}

function cursorToObservable<TStored, TValue=TStored>(
  dbPromise : Promise<DB>,
  objectStore : string,
  getCursor : (tx : Transaction, callback : (cursor : Cursor<TStored, any>) => void) => void,
  getValue : (cursor : Cursor<TStored, any>) => TValue) {

  return new Observable<TValue>(s => {
    let running = false;
    dbPromise.then(db => {
      const tx = db.transaction(objectStore);
      running = true;
      getCursor(tx, cursor => {
        if (!cursor) return;
        s.next(getValue(cursor));
        if(running) cursor.continue();
      });
      tx.complete
        .then(() => {
          s.complete();
        }, e => {
          s.error(e);
        });
    });
    return () => {
      running = false;
    };
  });
}

export async function push(user : OauthData, components : string[], progress : (status: string) => void) {
  const repo = await _repo;
  const result = await repo.push(
    `/git/${user.server}/${user.username}/${user.repo}.git`,
    components.map(c => ({
      local: `refs/heads/${c}`,
      tracking: `refs/remotes/origin/${c}`
    })),
    {
      username: user.username,
      password: user.access_token
    },
    {
      progress
    });
  return result.map(ref => ({
    name: ref.local.substr('refs/heads/'.length)
  }));
}

export async function fetchComponent(url : string, component : string, hash : string | undefined, progress : (status: string) => void) {
  const repo = await _repo;

  const remoteRefs = await repo.lsRemote(`/git/${url}.git`);

  if(remoteRefs.some(ref => ref.name === `refs/heads/${component}` && (!hash || ref.hash === hash))){
    const response = await repo.fetch(
      `/git/${url}.git`,
      `refs/heads/${component}:refs/remotes/${url}/${component}`,
      {
        depth: 1,
        progress
      });
    return response.length > 0;
  }else if(hash){
    const response = await repo.fetch(
      `/git/${url}.git`,
      hash,
      {
        depth: 1,
        progress
      });
    return await repo.hasObject(hash);
  }else{
    return false;
  }
}

export async function fetch(progress : (status: string) => void){
  if(user == null) return [];
  const repo = await _repo;
  console.log('start fetch');
  const response = await repo.fetch(
    `/git/${user.server}/${user.username}/${user.repo}.git`,
    `refs/heads/*:refs/remotes/origin/*`,
    {progress});
  console.log('fetch done');
  return response;
}

export async function clone(url : string, progress : (status: string) => void) {
  const repo = await _repo;
  const response = await repo.clone(`/git/${url}.git`, progress);
  console.log('success', response);
}

export async function pull(refs : string[]){
  const repo = await _repo;
  for(const ref of refs){
    const hash = await repo.getRef(`refs/remotes/origin/${ref}`);
    await repo.setRef(`refs/heads/${ref}`, hash);
  }
}

export async function status(...refs : string[]){
  const repo = await _repo;
  const allRefs = await repo.listRefs();
  const localRefs = await Promise.all(allRefs.filter(r => r.startsWith('refs/heads/')).map(getRef(repo, 'local', 11)));
  const remoteRefs = await Promise.all(allRefs.filter(r => r.startsWith('refs/remotes/origin/')).map(getRef(repo, 'remote', 20)));

  const list = await Promise.all(
    join(localRefs, remoteRefs)
    .filter(ref => refs.length === 0 || refs.includes(ref.name))
    .map(async ref => ({
      name: ref.name,
      type: ref.local === ref.remote ? 'ok' :
            !ref.local ? 'behind' :
            !ref.remote ? 'infront' :
            await walk(ref.local, ref.remote, repo)
  })));

  return {
    ok: list.filter(r => r.type === 'ok').map(r => r.name),
    behind: list.filter(r => r.type === 'behind').map(r => r.name),
    infront: list.filter(r => r.type === 'infront').map(r => r.name),
    diverged: list.filter(r => r.type === 'diverged').map(r => r.name)
  };
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

interface RefStatus {
  readonly name : string
  local? : string
  remote? : string
}

interface NameAndType {
  readonly name : string
  readonly type : 'ok' | 'infront' | 'behind' | 'diverged'
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

export function getUser() : OauthData | null {
  const user = JSON.parse(localStorage.getItem('ekkiog-user') || 'null');
  if(!user) return null;
  if(!user.repo){
    user.repo = 'ekkiog-workspace';
  }
  return user;
}

export function setUser(user : OauthData) {
  localStorage.setItem('ekkiog-user', JSON.stringify(user));
}

export async function deleteAllData(){
  setUser(null as any);
  const db = await _db;
  db.close();
  await idb.delete('ekkiog').then(() => console.log('deleted'), e => console.error(e));
}