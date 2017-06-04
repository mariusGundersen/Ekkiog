import idb, {DB, Transaction, ObjectStore, Cursor} from 'idb';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import {
  packageComponent,
  createForest,
  Forest,
  CompiledComponent
} from 'ekkiog-editing';

import { commit, checkout } from './repo';

import upgradeFrom0 from './upgrade/from0';
import upgradeFrom5 from './upgrade/from5';
import upgradeFrom7 from './upgrade/from7';

const db = idb.open('ekkiog', 10, db => {
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
    case 7:
    case 8:
      upgradeFrom7(db);
    case 9:
      return;
  }
});

export interface NamedForest extends Forest {
  name : string
};

export interface ComponentMetadata {
  readonly name : string
  readonly usedAt : Date
  readonly useCount : number
  readonly favorite : boolean
}

export class Storage{
  private readonly db : Promise<DB>;
  constructor(db : Promise<DB>){
    this.db = db;
  }

  async save(name : string, forest : Forest){
    await commit(name, {name: 'marius', email: 'gundersen@gmail.com'}, forest, 'test commit, please ignore');
    await checkout(name);
    const db = await this.db;
    const transaction = db.transaction([
      'components',
      'componentMetadata'
    ], 'readwrite');

    await transaction
      .objectStore('components')
      .put({
        name,
        ...forest
      });

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

  async export(){
    const db = await this.db;
    const transaction = db.transaction([
      'components',
      'componentMetadata',
    ], 'readonly');

    const components = exportToArray(transaction.objectStore("components"));
    const componentMetadata = exportToArray(transaction.objectStore("componentMetadata"));

    return {
      components: await components,
      componentMetadata: await componentMetadata
    };
  }

  async import(json : {components : any[], componentMetadata : any[]}){
    const db = await this.db;
    const transaction = db.transaction([
      'components',
      'componentMetadata',
    ], 'readwrite');

    const componentStore = transaction.objectStore('components');
    await componentStore.clear();
    await Promise.all(json.components.map(component => componentStore.put(component)));
    const componentMetadataStore = transaction.objectStore('componentMetadata');
    await componentMetadataStore.clear();
    await Promise.all(json.componentMetadata.map(componentMetadata => componentMetadataStore.put(componentMetadata)));
  }

  async load(name : string) : Promise<NamedForest>{
    const db = await this.db;
    const transaction = db.transaction([
      'components',
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

function exportToArray(objectStore : ObjectStore){
  return new Promise(res => {
    const content : any[] = [];
    objectStore.iterateCursor(cursor => {
      if (!cursor) return res(content);
      content.push(cursor.value);
      cursor.continue();
    });
  });
}