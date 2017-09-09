import { Item, TreeNode as EnneaNode, Forest, Box, BuddyNode, upgradeItem } from 'ekkiog-editing';
import { BoxedData } from 'ennea-tree';

import { Constructor, IRawRepo, Type, Mode, Hash } from '@es-git/core';
import { IObjectRepo, Person, ModeHash, TreeBody, CommitBody, textToBlob } from '@es-git/object-mixin';
import { ILoadAsRepo } from '@es-git/load-as-mixin';

export interface ILoadForestRepo {
   checkout(branch : string) : Promise<ForestWithHash>
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
      const commit = await super.loadCommit(hash);

      const tree = await super.loadTree(commit.tree);
      const enneaTree = await this.loadEnnea(await super.loadTree(tree['ennea'].hash));
      const buddyTree = await this.loadBuddy(await super.loadTree(tree['buddy'].hash));

      return {
        hash,
        enneaTree,
        buddyTree
      }
    }

    async loadEnnea(body : TreeBody, size = 128) : Promise<EnneaNode> {
      return {
        size,
        data: body['0'] ? upgradeItem(JSON.parse(await super.loadText(body['0'].hash))) : undefined,
        topLeft: body['1'] ? await this.loadEnnea(await super.loadTree(body['1'].hash), size/2) : undefined,
        top: body['2'] ? await this.loadList(await super.loadTree(body['2'].hash)) : [],
        topRight: body['3'] ? await this.loadEnnea(await super.loadTree(body['3'].hash), size/2) : undefined,
        left: body['4'] ? await this.loadList(await super.loadTree(body['4'].hash)) : [],
        center: body['5'] ? JSON.parse(await super.loadText(body['5'].hash)) : undefined,
        right: body['6'] ? await this.loadList(await super.loadTree(body['6'].hash)) : [],
        bottomLeft: body['7'] ? await this.loadEnnea(await super.loadTree(body['7'].hash), size/2) : undefined,
        bottom: body['8'] ? await this.loadList(await super.loadTree(body['8'].hash)) : [],
        bottomRight: body['9'] ? await this.loadEnnea(await super.loadTree(body['9'].hash), size/2) : undefined
      };
    }

    async loadBuddy(body : TreeBody) : Promise<BuddyNode> {
      return {
        ...JSON.parse(await super.loadText(body['d'].hash)),
        left: body['l'] ? await this.loadBuddy(await super.loadTree(body['l'].hash)) : undefined,
        right: body['r'] ? await this.loadBuddy(await super.loadTree(body['r'].hash)) : undefined
      };
    }

    async loadList(items : TreeBody) : Promise<EnneaLeaf[]> {
      const result = [] as EnneaLeaf[];
      for(const item of Object.keys(items)){
        result[parseInt(item)] = upgradeAreaItem(JSON.parse(await super.loadText(items[item].hash)));
      }
      return result;
    }
  }
}

function upgradeAreaItem(area : EnneaLeaf){
  return {
    ...area,
    data: upgradeItem(area.data)
  }
}