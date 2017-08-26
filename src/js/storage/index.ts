import idb, {DB, Transaction, ObjectStore, Cursor} from 'idb';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import {
  packageComponent,
  createForest,
  Forest,
  CompiledComponent
} from 'ekkiog-editing';

import { IRepo, Repo } from './repo';

import upgradeFrom10 from './upgrade/from10';
import upgradeFrom7 from './upgrade/from7';

const db = idb.open('ekkiog', 11, db => {
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
      upgradeFrom7(db);
    case 9:
    case 10:
      upgradeFrom10(db);
  }
});

export interface ComponentMetadata {
  readonly name : string
  readonly usedAt : Date
  readonly useCount : number
  readonly favorite : boolean
}

export class Storage{
  private readonly db : Promise<DB>;
  private readonly repo : Promise<IRepo>;
  constructor(db : Promise<DB>){
    this.db = db;
    this.repo = db.then(db => new Repo({}, db));
  }

  async save(name : string, forest : Forest, message : string){
    const repo = await this.repo;
    await repo.save(name, forest, message);
    const db = await this.db;
    const transaction = db.transaction([
      'componentMetadata'
    ], 'readwrite');

    const metadataStore = transaction.objectStore('componentMetadata');
    const metadata = await metadataStore.get(name);
    if(metadata == undefined){
      await metadataStore
        .put({
          name,
          useCount: 1,
          usedAt: new Date(),
          favorite: 'false'
        });
    }
  }

  async load(name : string) : Promise<Forest>{
    const db = await this.db;
    const transaction = db.transaction([
      'componentMetadata',
    ], 'readwrite');
    const metadataStore = transaction.objectStore('componentMetadata');
    const metadata = await metadataStore.get(name);
    await metadataStore
      .put({
        name,
        useCount: metadata ? (metadata.useCount||0)+1 : 1,
        usedAt: new Date(),
        favorite: (metadata && metadata.favorite === 'true') ? 'true' : 'false'
      });
    const repo = await this.repo;
    return await repo.load(name);
  }

  async loadPackage(name : string) : Promise<CompiledComponent>{
    const forest = await this.load(name)
    return packageComponent(forest, name);
  }

  getRecent() : Observable<string> {
    return cursorToObservable<string>(
      this.db,
      db => db.transaction('componentMetadata'),
      (tx, callback) => {
        const store = tx.objectStore('componentMetadata');
        const index = store.index('usedAt');
        const range = IDBKeyRange.upperBound(new Date(2100, 1));
        index.iterateCursor(range, 'prev', callback);
      },
      cursor => cursor.value.name as string);
  }

  getPopular() : Observable<string> {
    return cursorToObservable<string>(
      this.db,
      db => db.transaction('componentMetadata'),
      (tx, callback) => {
        const store = tx.objectStore('componentMetadata');
        const index = store.index('useCount');
        const range = IDBKeyRange.upperBound(Number.MAX_SAFE_INTEGER);
        index.iterateCursor(range, 'prev', callback);
      },
      cursor => cursor.value.name as string);
  }

  getFavorite() : Observable<string> {
    return cursorToObservable<string>(
      this.db,
      db => db.transaction('componentMetadata'),
      (tx, callback) => {
        const store = tx.objectStore('componentMetadata');
        const index = store.index('favorite');
        const range = IDBKeyRange.only('true');
        index.iterateCursor(range, 'prev', callback);
      },
      cursor => cursor.value.name as string);
  }

  async toggleFavorite(name : string) {
    const db = await this.db;
    const tx = db.transaction('componentMetadata', 'readwrite');
    const store = tx.objectStore('componentMetadata');
    const metadata = await store.get(name);
    await store.put({
      ...metadata,
      favorite: (metadata && metadata.favorite === 'true') ? 'false' : 'true'
    });
  }

  getComponentNames() : Observable<ComponentMetadata> {
    return cursorToObservable<ComponentMetadata>(
      this.db,
      db => db.transaction('componentMetadata'),
      (tx, callback) => tx.objectStore('componentMetadata').iterateCursor(callback),
      cursor => ({
        ...cursor.value,
        favorite: cursor.value.favorite === 'true'
      }));
  }
}

const singleton = new Storage(db);
export default singleton;

window.debugStorage = singleton;

function cursorToObservable<T>(
  db : Promise<DB>,
  getTransaction : (db : DB) => Transaction,
  getCursor : (tx : Transaction, callback : (cursor : Cursor) => void) => void,
  getValue : (cursor : Cursor) => T) {

  return new Observable<T>(s => {
    let running = false;
    db.then(db => {
      running = true;
      const tx = getTransaction(db);
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
