import { openDB, DBSchema, deleteDB } from 'idb';
import { } from 'idb/lib/async-iterators';
import { Observable } from 'rxjs';

import {
  packageComponent,
  Forest,
  Package
} from '../editing';

import Repo from './repo';

import upgradeFrom10 from './upgrade/from10';
import upgradeFrom11 from './upgrade/from11';
import findCommonCommits, { HashAndCommit, CommitWithParents } from '@es-git/push-mixin/es/findCommonCommits';

export interface ComponentDB extends DBSchema {
  'recent': {
    key: [string, string],
    value: RecentComponent,
    indexes: { 'usedAt': Date },
  },
  'favorite': {
    value: FavoriteComponent,
    key: [string, string]
  }
}

export interface ComponentMetadata {
  readonly repo: string
  readonly name: string
  readonly favorite: boolean
  readonly usedAt: Date
}

export interface RecentComponent {
  readonly repo: string
  readonly name: string
  readonly usedAt: Date
}

export interface FavoriteComponent {
  readonly repo: string
  readonly name: string
}

const THE_YEAR_2000 = new Date(2000, 1);
const THE_YEAR_2100 = new Date(2100, 1);

const _db = openDB<ComponentDB>('ekkiog', 12, {
  upgrade(db, oldVersion) {
    switch (oldVersion) {
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
  }
});

const _repo = _db.then(db => new Repo({}, db));
const user = getUser();

export async function create(name: string, forest: Forest): Promise<string> {
  const repo = await _repo;
  const hash = await repo.save(name, forest, `Created ${name}`, user);
  await updateRecent('', name);
  return hash;
}

export async function save(name: string, forest: Forest, message: string): Promise<string> {
  const repo = await _repo;
  const hash = await repo.save(name, forest, message, user);
  await updateRecent('', name);
  return hash;
}

export async function load(repo: string, name: string, hash?: string) {

  const result = await _repo.then(r => hash ? r.load(hash) : r.load(repo, name));
  await updateRecent(repo, name);
  return result;
}

async function updateRecent(repo: string, name: string) {
  try {
    const db = await _db;
    const transaction = db.transaction([
      'recent',
    ], 'readwrite');
    const recents = transaction.objectStore('recent');
    await recents
      .put({
        repo,
        name,
        usedAt: new Date()
      });
  } catch (e) {
    console.error(e);
  }
}

export async function loadPackage(repo: string, name: string): Promise<Package> {
  const forest = await load(repo, name);
  return packageComponent(forest, repo, name, forest.hash, forest.hash);
}

export async function getHash(repo: string, name: string): Promise<string | undefined> {
  return _repo.then(r => r.getHash(repo, name));
}

export function getRecent(): Observable<RecentComponent> {
  return new Observable<RecentComponent>(s => {
    let running = true;
    async function run() {
      try {
        const db = await _db;
        const index = await db
          .transaction('recent')
          .objectStore('recent')
          .index('usedAt')
          .iterate(IDBKeyRange.upperBound(THE_YEAR_2100), 'prev');

        for await (const cursor of index) {
          if (!running) return;
          s.next(cursor.value);
        }

        s.complete();
      } catch (e) {
        s.error(e);
      }
    }

    run();

    return () => {
      running = false;
    };
  });
}

export function getFavorite(): Observable<FavoriteComponent> {
  return new Observable<FavoriteComponent>(s => {
    let running = true;
    async function run() {
      try {
        const db = await _db;
        const index = await db
          .transaction('favorite')
          .objectStore('favorite');

        for await (const cursor of index) {
          if (!running) return;
          s.next(cursor.value);
        }

        s.complete();
      } catch (e) {
        s.error(e);
      }
    }

    run();

    return () => {
      running = false;
    };
  });
}

export async function toggleFavorite(repo: string, name: string) {
  const db = await _db;
  const tx = db.transaction('favorite', 'readwrite');
  const store = tx.objectStore('favorite');
  const favorite = await store.get([repo, name]).catch(() => undefined);
  if (favorite) {
    const tx = db.transaction('favorite', 'readwrite');
    const store = tx.objectStore('favorite');
    await store.delete([repo, name]);
  } else {
    const tx = db.transaction('favorite', 'readwrite');
    const store = tx.objectStore('favorite');
    await store.put({ repo, name });
  }
}

export async function getAllComponents(): Promise<ComponentMetadata[]> {
  const repo = await _repo;
  const refs = await repo.listRefs();
  const db = await _db;
  const tx = db.transaction(['favorite', 'recent'], 'readonly');
  const favorites = tx.objectStore('favorite');
  const recents = tx.objectStore('recent');
  return await Promise.all(refs
    .map(refToRepoAndName)
    .filter(data => data.repo !== 'origin')
    .map(async ({ name, repo }) => {
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

export async function getOwnedComponents(): Promise<string[]> {
  const repo = await _repo;
  const refs = await repo.listRefs();
  return refs
    .map(refToRepoAndName)
    .filter(data => data.repo !== 'origin')
    .filter(data => data.repo === '')
    .map(data => data.name);
}

function refToRepoAndName(ref: string) {
  const [, type, ...repoAndName] = ref.split('/');
  if (type === 'heads') {
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

export async function push(user: OauthData, components: string[], progress: (status: string) => void) {
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

export async function fetchComponent(url: string, component: string, hash: string | undefined, progress: (status: string) => void) {
  const repo = await _repo;

  const remoteRefs = await repo.lsRemote(`/git/${url}.git`);

  if (remoteRefs.some(ref => ref.name === `refs/heads/${component}` && (!hash || ref.hash === hash))) {
    const response = await repo.fetch(
      `/git/${url}.git`,
      `refs/heads/${component}:refs/remotes/${url}/${component}`,
      {
        depth: 1,
        progress
      });
    return response.length > 0;
  } else if (hash) {
    return await repo.hasObject(hash);
  } else {
    return false;
  }
}

export async function fetch(progress: (status: string) => void) {
  if (user == null) return [];
  const repo = await _repo;
  console.log('start fetch');
  const response = await repo.fetch(
    `/git/${user.server}/${user.username}/${user.repo}.git`,
    `refs/heads/*:refs/remotes/origin/*`,
    { progress });
  console.log('fetch done');
  return response;
}

export async function clone(url: string, progress: (status: string) => void) {
  const repo = await _repo;
  const response = await repo.clone(`/git/${url}.git`, progress);
  console.log('success', response);
}

export async function pull(refs: string[]) {
  const repo = await _repo;
  for (const ref of refs) {
    const hash = await repo.getRef(`refs/remotes/origin/${ref}`);
    await repo.setRef(`refs/heads/${ref}`, hash);
  }
}

export async function status(...refs: string[]) {
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

async function walk(local: string, remote: string, repo: Repo) {
  const localWalk = repo.walkCommits(local);
  const remoteWalk = repo.walkCommits(remote);
  const common: HashAndCommit<CommitWithParents>[] = await findCommonCommits(localWalk, remoteWalk);
  if (common.length) {
    if (common[0].hash === local) {
      return 'behind';
    } else if (common[0].hash === remote) {
      return 'infront';
    }
  }

  return 'diverged';
}

interface RefStatus {
  readonly name: string
  local?: string
  remote?: string
}


function join(localRefs: RefStatus[], remoteRefs: RefStatus[]) {
  const refMap = new Map(localRefs.map(r => [r.name, r] as [string, RefStatus]));
  for (const remoteRef of remoteRefs) {
    const localRef = refMap.get(remoteRef.name);
    if (localRef) {
      localRef.remote = remoteRef.remote;
    } else {
      refMap.set(remoteRef.name, remoteRef);
    }
  }

  return [...refMap.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function getRef(repo: Repo, key: 'local' | 'remote', trim: number) {
  return async (ref: string): Promise<RefStatus> => {
    const hash = await repo.getRef(ref);
    return {
      name: ref.substr(trim),
      [key]: hash
    }
  }
}

export function getUser(): OauthData | null {
  const user = JSON.parse(localStorage.getItem('ekkiog-user') || 'null');
  if (!user) return null;
  if (!user.repo) {
    user.repo = 'ekkiog-workspace';
  }
  return user;
}

export function setUser(user: OauthData) {
  localStorage.setItem('ekkiog-user', JSON.stringify(user));
}

export async function deleteAllData() {
  setUser(null as any);
  const db = await _db;
  db.close();
  await deleteDB('ekkiog').then(() => console.log('deleted'), e => console.error(e));
}
