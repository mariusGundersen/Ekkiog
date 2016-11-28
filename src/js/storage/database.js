import idb from 'idb';

const PATH = 'ekkiog[0.0.4].save';

export async function open(){
  const db = await idb.open('ekkiog', 1, async (db) => {
    switch(db.oldVersion){
      case 0:
        const saves = await db.createObjectStore('saves');
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
