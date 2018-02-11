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
  load(hash : string) : Promise<ForestWithHash>
  getHash(repo : string, name : string) : Promise<string | undefined>
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
      return await super.commit(`refs/heads/${name}`, user || defaultUser, forest, message, name);
    }

    async load(hash : string) : Promise<ForestWithHash>
    async load(repo : string, name : string) : Promise<ForestWithHash>
    async load(repoOrHash : string, name? : string){
      if(!name){
        return await super.checkoutCommit(repoOrHash);
      }else{
        return await super.checkout(getRef(repoOrHash, name));
      }
    }

    async getHash(repo : string, name : string) : Promise<string | undefined> {
      return await super.getRef(getRef(repo, name));
    }

    async clone(url : string, progress : (status: string) => void){
      const response = await super.fetch(url, `refs/heads/*:refs/heads/*`, {progress});

      await Promise.all(response.map(ref => ({
        name: ref.name.replace(/^refs\/heads\//, 'refs/remotes/origin'),
        hash: ref.hash
      })).map(ref => super.setRef(ref.name, ref.hash)));

      return response;
    }
};

const getRef = (repo : string, name : string) => repo.length === 0 ? getLocalRef(name) : getRemoteRef(repo, name);
const getLocalRef = (name: string) => `refs/heads/${name}`;
const getRemoteRef = (repo: string, name: string) => `refs/remotes/${repo}/${name}`;
