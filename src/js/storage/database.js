import idb from 'idb';
import Rx from 'rxjs/Rx.js';

import xor from './xor.json';

import upgradeFrom0 from './upgrade/from0.js';
import upgradeFrom1 from './upgrade/from1.js';
import upgradeFrom2 from './upgrade/from2.js';

export async function open(){
  const db = await idb.open('ekkiog', 3, async (db) => {
    switch(db.oldVersion){
      case 0:
        await upgradeFrom0(db);
      case 1:
        await upgradeFrom1(db);
      case 2:
        await upgradeFrom2(db);
    }
  });

  return new Storage(db);
}

class Storage{
  constructor(db){
    this.db = db;
  }

  async save(map){
    return await this.db.transaction('saves', 'readwrite').objectStore('saves').put(map, 'default');
  }

  async load(){
    const result = await this.db.transaction('saves').objectStore('saves').get('default');
    return result || xor;
  }

  async saveComponent(name, forest){
    return await this.db
      .transaction('componets', 'readwrite')
      .objectStore('componets')
      .put({
        name,
        forest
      });
  }

  async loadComponent(name){
    return await this.db
      .transaction('componets')
      .objectStore('componets')
      .get(name);
  }

  getComponentNames(){
    return new Rx.Observable(s => {
      const tx = db.transaction('components');
      tx.objectStore('components').iterateCursor(cursor => {
        if (!cursor) return;
        s.next(cursor.key);
        cursor.continue();
      });
      tx.complete.then(() => s.complete());
      s.add(() => tx.abort());
    });
  }
}
