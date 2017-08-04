import { Forest } from 'ekkiog-editing';
import { mix } from '@es-git/core';
import IdbRepo, { init } from '@es-git/idb-repo';
import objectMixin from '@es-git/object-mixin';
import cacheObjectsMixin from '@es-git/cache-objects-mixin';
import loadAsMixin from '@es-git/load-as-mixin';
import saveAsMixin from '@es-git/save-as-mixin';

import saveForestMixin from './saveForest';
import loadForestMixin from './loadForest';

export interface IRepo {
  save(name : string, forest : Forest) : Promise<void>
  load(name : string) : Promise<Forest>
}

export class Repo extends mix(IdbRepo)
  .with(objectMixin)
  .with(cacheObjectsMixin)
  .with(loadAsMixin)
  .with(loadForestMixin)
  .with(saveAsMixin)
  .with(saveForestMixin)
  implements IRepo {
    async save(name : string, forest : Forest){
      return await super.commit(`refs/heads/${name}`, {}, forest, '');
    }

    async load(name : string){
      return await super.checkout(`refs/heads/${name}`);
    }
};

export default async function createRepo() : Promise<IRepo>{
  const db = await init('ekkiog-git');

  const repo = new Repo(db, {});

  return repo;
}

