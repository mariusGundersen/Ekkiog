import idb, {DB, Transaction, ObjectStore, Cursor} from 'idb';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import {
  packageComponent,
  createForest,
  Forest,
  CompiledComponent
} from 'ekkiog-editing';

import upgradeFrom0 from './upgrade/from0';
import upgradeFrom5 from './upgrade/from5';
import upgradeFrom6 from './upgrade/from6';

const db = idb.open('ekkiog', 7, db => {
  switch(db.oldVersion){
    case 0:
      upgradeFrom0(db);
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      upgradeFrom5(db);
    case 6:
      upgradeFrom6(db);
  }
});

export interface NamedForest extends Forest {
  name : string
};

export class Storage{
  private readonly db : Promise<DB>;
  constructor(db : Promise<DB>){
    this.db = db;
  }

  async save(name : string, forest : Forest){
    const db = await this.db;
    return await db
      .transaction('components', 'readwrite')
      .objectStore('components')
      .put({
        name,
        ...forest
      });
  }

  async load(name : string) : Promise<NamedForest>{
    const db = await this.db;
    const transaction = db.transaction([
      'components',
      'recent',
      'popular'
    ], 'readwrite');
    await transaction
      .objectStore('recent')
      .put({
        name,
        usedAt: new Date()
      });
    const popular = transaction.objectStore('popular');
    const useCount = await popular.get(name);
    await popular
      .put({
        name,
        useCount: useCount ? useCount.useCount : 0
      });
    return await transaction
      .objectStore('components')
      .get(name)
      .then(
        x => ({
          name,
          ...(x as Forest || createForest())
        }),
        x => ({
          name,
          ...createForest()
        }));
  }

  async loadPackage(name : string) : Promise<CompiledComponent>{
    const namedForest = await this.load(name)
    return packageComponent(namedForest, namedForest.name);
  }

  getRecent() : Observable<string> {
    return cursorToObservable<string>(
      this.db,
      db => db.transaction('recent'),
      (tx, callback) => {
        const store = tx.objectStore('recent');
        const index = store.index('usedAt');
        const range = IDBKeyRange.upperBound(new Date(2100, 1));
        index.iterateCursor(range, 'prev', callback);
      },
      cursor => cursor.value.name as string);
  }

  getComponentNames() : Observable<string> {
    return cursorToObservable<string>(
      this.db,
      db => db.transaction('components'),
      (tx, callback) => tx.objectStore('components').iterateCursor(callback),
      cursor => cursor.key as string);
  }
}

export default new Storage(db);

function cursorToObservable<T>(
  db : Promise<DB>,
  getTransaction : (db : DB) => Transaction,
  getCursor : (tx : Transaction, callback : (cursor : Cursor) => void) => void,
  getValue : (cursor : Cursor) => T) {

  const s = new Subject<T>();
  db.then(db => {
    const tx = getTransaction(db);
    getCursor(tx, cursor => {
      if (!cursor) return;
      s.next(getValue(cursor));
      cursor.continue();
    });
    s.subscribe(() => {}, () => {}, () => console.log('closed'));
    tx.complete
      .then(() => {
        s.complete();
      }, e => {
        s.error(e);
      });
  });
  return s;
}

declare module "idb" {
  export interface Index {
    iterateCursor(range: IDBKeyRange | IDBValidKey, callback: (c: Cursor) => void): void;
    iterateCursor(range: IDBKeyRange | IDBValidKey, direction: 'next' | 'nextunique' | 'prev' | 'prevunique', callback: (c: Cursor) => void): void;
  }
}