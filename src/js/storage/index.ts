import idb, {DB} from 'idb';
import * as Rx from 'rxjs/Rx.js';

import {
  packageComponent,
  createForest,
  Forest,
  CompiledComponent
} from 'ekkiog-editing';

import upgradeFrom0 from './upgrade/from0';
import upgradeFrom5 from './upgrade/from5';

const db = idb.open('ekkiog', 6, db => {
  switch(db.oldVersion){
    case 0:
      upgradeFrom0(db);
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      upgradeFrom5(db);
  }
});

export default new Storage(db);

export interface NamedForest extends Forest {
  name : string
};

export class Storage{
  db : Promise<DB>;
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
    return await db
      .transaction('components')
      .objectStore('components')
      .get(name)
      .then(
        x => x || createForest(),
        x => createForest());
  }

  async loadPackage(name : string) : Promise<CompiledComponent>{
    return await this.load(name)
      .then(component => packageComponent(component, component.name));
  }

  getComponentNames(){
    return new Rx.Observable<string>(s => {
      this.db.then(db => {
        const tx = db.transaction('components');
        tx.objectStore('components').iterateCursor(cursor => {
          if (!cursor) return;
          s.next(cursor.key as string);
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
    });
  }
}
