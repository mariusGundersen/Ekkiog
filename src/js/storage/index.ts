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

export interface ComponentMetadata {
  readonly repo : string
  readonly name : string
  readonly favorite : boolean
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
export const user : OauthData | null = JSON.parse(localStorage.getItem('ekkiog-user') || 'null') as OauthData | null;

export async function save(name : string, forest : Forest, message : string) : Promise<string> {
  const repo = await _repo;
  return await repo.save(name, forest, message, user);
}

export async function load(repo : string, name : string, version : string){
  const db = await _db;
  const transaction = db.transaction([
    'recent',
  ], 'readwrite');
  const metadataStore = transaction.objectStore<RecentComponent>('recent');
  await metadataStore
    .put({
      repo,
      name,
      usedAt: new Date()
    });
  return await (await _repo).load(repo, name);
}

export async function loadPackage(repo : string, name : string, version : string) : Promise<CompiledComponent>{
  const forest = await load(repo, name, version);
  return packageComponent(forest, repo, name, version, forest.hash);
}

export function getRecent() : Observable<RecentComponent> {
  return cursorToObservable<RecentComponent>(
    _db,
    'recent',
    (tx, callback) => {
      const store = tx.objectStore<RecentComponent>('recent');
      const index = store.index('usedAt');
      const range = IDBKeyRange.upperBound(new Date(2100, 1));
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
    await store.delete([repo, name]);
  }else{
    await store.put({repo, name});
  }
}

export async function searchComponents(query : string) : Promise<ComponentMetadata[]> {
  const repo = await _repo;
  const refs = await repo.listRefs();
  const db = await _db;
  const tx = db.transaction('favorite', 'readwrite');
  const store = tx.objectStore<FavoriteComponent, [string, string]>('favorite');
  return await Promise.all(refs
    .map(refToRepoAndName)
    .filter(data => data.name.toUpperCase().indexOf(query) >= 0)
    .sort(bySimilarityTo(query))
    .map(async ({name, repo}) => ({
      name,
      repo,
      favorite: await store.get([repo, name]).then(x => x ? true : false, () => false)
    })));
}

function bySimilarityTo(query : string){
  return (a : {name : string, repo : string}, b : {name : string, repo : string}) => (
    (a.repo > b.repo ? 1 : a.repo < b.repo ? -1 : 0)
    || (a.name.indexOf(query) - b.name.indexOf(query))
    || (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
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

export async function push(workspace : string, component : string) {
  if(!user) return;
  const repo = await _repo;
  await repo.push(`/git/${user.server}/${user.username}/${workspace}.git`, `refs/heads/${component}`, {
    username: user.username,
    password: user.access_token
  });
}

export async function fetch(url : string, component : string) {
  const repo = await _repo;
  const response = await repo.fetch(`/git/${url}.git`, {
    refspec: `refs/heads/${component}:refs/remotes/${url}/${component}`,
    depth: 1
  });
  console.log('success', response);
}