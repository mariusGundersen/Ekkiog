import { Item, EnneaTree, Forest, BuddyTree, upgradeItem } from '../editing';
import { BoxedData } from 'ennea-tree';

import { Constructor, IRawRepo, Hash } from '@es-git/core';
import { IObjectRepo, TreeBody } from '@es-git/object-mixin';
import { ILoadAsRepo } from '@es-git/load-as-mixin';

export interface ILoadForestRepo {
   checkout(branch : string) : Promise<ForestWithHash>
   checkoutCommit(hash : string) : Promise<ForestWithHash>
}

export interface ForestWithHash extends Forest {
  readonly hash : Hash
}

type EnneaLeaf = BoxedData<Item>;

export default function mixin<T extends Constructor<IRawRepo & IObjectRepo & ILoadAsRepo>>(repo : T) : Constructor<ILoadForestRepo> & T {
  return class LoadForestRepo extends repo implements ILoadForestRepo {
    constructor(...args : any[]){
      super(...args);
    }

    async checkout(branch : string){
      const hash = await super.getRef(branch);
      if(!hash) throw new Error();
      return await this.checkoutCommit(hash);
    }

    async checkoutCommit(hash : string){
      const commit = await super.loadCommit(hash);

      const tree = await super.loadTree(commit.tree);
      const [enneaTree, buddyTree] = await Promise.all([
        super.loadTree(tree['ennea'].hash).then(t => this.loadEnnea(t)),
        super.loadTree(tree['buddy'].hash).then(t => this.loadBuddy(t))
      ]);

      return {
        hash,
        enneaTree,
        buddyTree
      }
    }

    async loadEnnea(body : TreeBody, size = 128) : Promise<EnneaTree> {
      const [
        data,
        topLeft,
        top,
        topRight,
        left,
        center,
        right,
        bottomLeft,
        bottom,
        bottomRight
      ] = await Promise.all([
        body['0'] ? super.loadText(body['0'].hash).then(JSON.parse).then(upgradeUnitItem) : undefined,
        body['1'] ? super.loadTree(body['1'].hash).then(t => this.loadEnnea(t, size/2)) : undefined,
        body['2'] ? super.loadTree(body['2'].hash).then(t => this.loadList(t)) : [],
        body['3'] ? super.loadTree(body['3'].hash).then(t => this.loadEnnea(t, size/2)) : undefined,
        body['4'] ? super.loadTree(body['4'].hash).then(t => this.loadList(t)) : [],
        body['5'] ? super.loadText(body['5'].hash).then(JSON.parse).then(upgradeBoxItem) : undefined,
        body['6'] ? super.loadTree(body['6'].hash).then(t => this.loadList(t)) : [],
        body['7'] ? super.loadTree(body['7'].hash).then(t => this.loadEnnea(t, size/2)) : undefined,
        body['8'] ? super.loadTree(body['8'].hash).then(t => this.loadList(t)) : [],
        body['9'] ? super.loadTree(body['9'].hash).then(t => this.loadEnnea(t, size/2)) : undefined
      ] as any[]);
      return {
        size,
        data,
        topLeft,
        top,
        topRight,
        left,
        center,
        right,
        bottomLeft,
        bottom,
        bottomRight,
      };
    }

    async loadBuddy(body : TreeBody) : Promise<BuddyTree> {
      const [
        data,
        left,
        right
      ] = await Promise.all([
        super.loadText(body['d'].hash).then(JSON.parse),
        body['l'] ? super.loadTree(body['l'].hash).then(x => this.loadBuddy(x)) : null,
        body['r'] ? super.loadTree(body['r'].hash).then(x => this.loadBuddy(x)) : null,
      ] as any[]);
      return {
        ...data,
        left,
        right
      };
    }

    async loadList(items : TreeBody) : Promise<EnneaLeaf[]> {
      const result = [] as EnneaLeaf[];
      for(const {index, item} of await Promise.all(Object.keys(items).map(async item => ({index: parseInt(item), item: upgradeBoxItem(JSON.parse(await super.loadText(items[item].hash)))})))){
        result[index] = item;
      }
      return result;
    }
  }
}

function upgradeUnitItem(item : Item){
  return upgradeItem(item, {width: 1, height: 1});
}

function upgradeBoxItem(box : EnneaLeaf){
  return {
    ...box,
    data: upgradeItem(box.data, {width: box.right-box.left, height: box.bottom - box.top})
  }
}