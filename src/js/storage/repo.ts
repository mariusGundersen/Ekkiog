import { Forest, createForest } from 'ekkiog-editing';
import { mix } from '@es-git/core';
import IdbRepo, { init } from '@es-git/idb-repo';
import objectMixin, { Person } from '@es-git/object-mixin';
import cacheObjectsMixin from '@es-git/cache-objects-mixin';
import loadAsMixin from '@es-git/load-as-mixin';
import saveAsMixin from '@es-git/save-as-mixin';

import saveForestMixin from './saveForest';
import loadForestMixin from './loadForest';

export interface IRepo {
  save(name : string, forest : Forest, message : string) : Promise<string>
  load(name : string) : Promise<Forest>
}

const me : Person = {
  name: 'Marius Gundersen',
  email: 'me@mariusgundersen.net',
  date: new Date()
};

export class Repo extends mix(IdbRepo)
  .with(objectMixin)
  .with(cacheObjectsMixin)
  .with(loadAsMixin)
  .with(loadForestMixin)
  .with(saveAsMixin)
  .with(saveForestMixin)
  implements IRepo {
    async save(name : string, forest : Forest, message : string){
      return await super.commit(`refs/heads/${name}`, {...me, date: new Date()}, forest, message);
    }

    async load(name : string){
      try{
        return await super.checkout(`refs/heads/${name}`);
      }catch(e){
        const forest = createForest();
        await super.create(`refs/heads/${name}`, {...me, date: new Date()}, forest, 'Initial commit');
        return forest;
      }
    }
};

export default async function createRepo() : Promise<IRepo>{
  const db = await init('ekkiog-git');

  return new Repo({}, db);
}

