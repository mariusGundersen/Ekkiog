import { Forest, createForest } from 'ekkiog-editing';
import { mix } from '@es-git/core';
import IdbRepo, { init } from '@es-git/idb-repo';
import objectMixin, { Person } from '@es-git/object-mixin';
import cacheObjectsMixin from '@es-git/cache-objects-mixin';
import loadAsMixin from '@es-git/load-as-mixin';
import saveAsMixin from '@es-git/save-as-mixin';
import walkersMixin from '@es-git/walkers-mixin';
import pushMixin from '@es-git/push-mixin';
import fetchMixin from '@es-git/fetch-mixin';

import saveForestMixin, { User } from './saveForest';
import loadForestMixin from './loadForest';

export interface IRepo {
  save(name : string, forest : Forest, message : string, user : User | null) : Promise<string>
  load(name : string) : Promise<Forest>
}

const defaultUser = {
  name : 'anonymous',
  email : 'anon@example.com'
}

export default class Repo extends mix(IdbRepo)
  .with(objectMixin)
  .with(cacheObjectsMixin)
  .with(loadAsMixin)
  .with(loadForestMixin)
  .with(saveAsMixin)
  .with(saveForestMixin)
  .with(walkersMixin)
  .with(pushMixin, fetch)
  .with(fetchMixin, fetch)
  implements IRepo {
    async save(name : string, forest : Forest, message : string, user : User | null){
      return await super.commit(`refs/heads/${name}`, user || defaultUser, forest, message);
    }

    async load(name : string){
      try{
        return await super.checkout(`refs/heads/${name}`);
      }catch(e){
        return createForest();
      }
    }
};
