import idb from 'idb';
import Rx from 'rxjs/Rx.js';

import {
  packageComponent
} from 'ekkiog-editing';

import upgradeFrom0 from './upgrade/from0.js';
import upgradeFrom5 from './upgrade/from5.js';

export async function open(){
  const db = await idb.open('ekkiog', 6, async (db) => {
    switch(db.oldVersion){
      case 0:
        await upgradeFrom0(db);
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        await upgradeFrom5(db);
    }
  });

  return new Storage(db);
}

class Storage{
  constructor(db){
    this.db = db;
  }

  async save(name, forest){
    return await this.db
      .transaction('components', 'readwrite')
      .objectStore('components')
      .put({
        name,
        ...forest
      });
  }

  async load(name){
    return await this.db
      .transaction('components')
      .objectStore('components')
      .get(name)
      .catch(x => null);
  }

  async loadPackage(name){
    return await this.db
      .transaction('components')
      .objectStore('components')
      .get(name)
      .then(packageComponent);
  }

  getComponentNames(){
    return new Rx.Observable(s => {
      const tx = this.db.transaction('components');
      tx.objectStore('components').iterateCursor(cursor => {
        if (!cursor) return;
        s.next(cursor.key);
        cursor.continue();
      });
      const abort = s.add(() => tx.abort());
      tx.complete
        .then(() => {
          s.remove(abort);
          s.complete();
        }, e => {
          s.remove(abort);
          s.error(e);
        });
    });
  }
}
