import { Forest, createForest } from 'ekkiog-editing';
import { mix } from '@es-git/core';
import IdbRepo, { init } from '@es-git/idb-repo';
import objectMixin, { Person } from '@es-git/object-mixin';
import cacheObjectsMixin from '@es-git/cache-objects-mixin';
import loadAsMixin from '@es-git/load-as-mixin';
import saveAsMixin from '@es-git/save-as-mixin';
import walkersMixin from '@es-git/walkers-mixin';
import pushMixin, { IPushRepo, Fetch } from '@es-git/push-mixin';
import fetchMixin, { IFetchRepo } from '@es-git/fetch-mixin';

import saveForestMixin, { User } from './saveForest';
import loadForestMixin, { ForestWithHash } from './loadForest';

export interface IRepo {
  save(name : string, forest : Forest, message : string, user : User | null) : Promise<string>
  load(repo : string, name : string) : Promise<ForestWithHash>
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
  .with<IPushRepo, Fetch>(pushMixin, fetch)
  .with<IFetchRepo, Fetch>(fetchMixin, fetch)
  implements IRepo {
    async save(name : string, forest : Forest, message : string, user : User | null){
      return await super.commit(`refs/heads/${name}`, user || defaultUser, forest, message);
    }

    async load(repo : string, name : string){
      if(repo.length === 0){
        return await super.checkout(`refs/heads/${name}`);
      }else{
        return await super.checkout(`refs/remotes/${repo}/${name}`);
      }
    }
};
