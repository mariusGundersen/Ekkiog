import { Item, TreeNode as EnneaNode, Forest, Box, BuddyNode } from 'ekkiog-editing';
import { BoxedData } from 'ennea-tree';

import { Constructor, IRawRepo, Type, Mode, Hash } from '@es-git/core';
import { IObjectRepo, Person, ModeHash, TreeBody, CommitBody, textToBlob } from '@es-git/object-mixin';
import { ILoadAsRepo } from '@es-git/load-as-mixin';

export interface ILoadForestRepo {
   checkout(branch : string) : Promise<Forest>
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
        enneaTree,
        buddyTree
      }
    }

    async loadEnnea(body : TreeBody, size = 128) : Promise<EnneaNode> {
      return {
        size,
        topLeft: body['topLeft'] ? await this.loadEnnea(await super.loadTree(body['topLeft'].hash), size/2) : undefined,
        topRight: body['topRight'] ? await this.loadEnnea(await super.loadTree(body['topRight'].hash), size/2) : undefined,
        bottomLeft: body['bottomLeft'] ? await this.loadEnnea(await super.loadTree(body['bottomLeft'].hash), size/2) : undefined,
        bottomRight: body['bottomRight'] ? await this.loadEnnea(await super.loadTree(body['bottomRight'].hash), size/2) : undefined,
        top: body['top'] && body['top'] ? await this.loadList(await super.loadTree(body['top'].hash)) : [],
        left: body['left'] && body['left'] ? await this.loadList(await super.loadTree(body['left'].hash)) : [],
        right: body['right'] && body['right'] ? await this.loadList(await super.loadTree(body['right'].hash)) : [],
        bottom: body['bottom'] && body['bottom'] ? await this.loadList(await super.loadTree(body['bottom'].hash)) : [],
        center: body['center'] ? JSON.parse(await super.loadText(body['center'].hash)) : undefined,
        data: body['data'] ? JSON.parse(await super.loadText(body['data'].hash)) : undefined
      };
    }

    async loadBuddy(body : TreeBody) : Promise<BuddyNode> {
      return {
        ...JSON.parse(await super.loadText(body['node'].hash)),
        left: body['left'] ? await this.loadBuddy(await super.loadTree(body['left'].hash)) : undefined,
        right: body['right'] ? await this.loadBuddy(await super.loadTree(body['right'].hash)) : undefined
      };
    }

    async loadList(items : TreeBody) : Promise<EnneaLeaf[]> {
      const result = [] as EnneaLeaf[];
      for(const item of Object.keys(items)){
        result[parseInt(item)] = JSON.parse(await super.loadText(items[item].hash));
      }
      return result;
    }
  }
}
