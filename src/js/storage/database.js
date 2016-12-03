import idb from 'idb';

import upgradeFrom0 from './upgrade/from0.js';
import upgradeFrom1 from './upgrade/from1.js';

export async function open(){
  const db = await idb.open('ekkiog', 2, async (db) => {
    switch(db.oldVersion){
      case 0:
        await upgradeFrom0(db);
      case 1:
        await upgradeFrom1(db);
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
    return await this.db.transaction('saves').objectStore('saves').get('default');
  }
}
