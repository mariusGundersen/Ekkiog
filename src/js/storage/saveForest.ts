import { Item, TreeNode as EnneaNode, Forest, Box, BuddyNode } from 'ekkiog-editing';
import { BoxedData } from 'ennea-tree';

import { Constructor, IRawRepo, Type, Mode, Hash } from '@es-git/core';
import { IObjectRepo, Person, ModeHash, TreeBody, CommitBody, textToBlob } from '@es-git/object-mixin';
import { ISaveAsRepo } from '@es-git/save-as-mixin';

export interface ISaveForestRepo {
  commit(branch : string, author : Person, forest : Forest, message : string) : Promise<string>
}

type EnneaLeaf = BoxedData<Item>;

export default function mixin<T extends Constructor<IRawRepo & IObjectRepo & ISaveAsRepo>>(repo : T) : Constructor<ISaveForestRepo> & T {
  return class SaveForestRepo extends repo implements ISaveForestRepo {
    private readonly hashCache : WeakMap<BuddyNode | EnneaNode | EnneaLeaf[] | EnneaLeaf | Item, Hash>
    constructor(...args : any[]){
      super(...args);
      this.hashCache = new WeakMap<BuddyNode | EnneaNode | EnneaLeaf[] | EnneaLeaf | Item, Hash>();
    }

    async commit(branch : string, person : {name : string, email : string}, forest : Forest, message : string){
      const parentHash = await super.getRef(branch);
      if(!parentHash) throw new Error('could not load parent hash');
      const tree = await this.saveForest(forest);

      const author : Person = {
        date: new Date(),
        email: person.email,
        name: person.name
      };

      const hash = await super.saveCommit({
        author,
        committer: author,
        message,
        tree: tree.hash,
        parents: [parentHash]
      });
      await super.setRef(branch, hash);
      return hash;
    }

    async saveForest({enneaTree, buddyTree} : Forest){
      const body = {};

      addTree(body, 'ennea', enneaTree ? this.hashCache.get(enneaTree) || await this.saveEnnea(enneaTree) : undefined);
      addTree(body, 'buddy', buddyTree ? this.hashCache.get(buddyTree) || await this.saveBuddy(buddyTree) : undefined);

      const hash = await super.saveTree(body);
      return {hash, mode : Mode.tree};
    }

    async saveEnnea(node : EnneaNode){
      const body = {};

      addTree(body, 'topLeft', node.topLeft ? this.hashCache.get(node.topLeft) || await this.saveEnnea(node.topLeft) : undefined);
      addTree(body, 'topRight', node.topRight ? this.hashCache.get(node.topRight) || await this.saveEnnea(node.topRight) : undefined);
      addTree(body, 'bottomLeft', node.bottomLeft ? this.hashCache.get(node.bottomLeft) || await this.saveEnnea(node.bottomLeft) : undefined);
      addTree(body, 'bottomRight', node.bottomRight ? this.hashCache.get(node.bottomRight) || await this.saveEnnea(node.bottomRight) : undefined);
      addTree(body, 'top', node.top.length ? this.hashCache.get(node.top) || await this.saveList(node.top) : undefined);
      addTree(body, 'left', node.left.length ? this.hashCache.get(node.left) || await this.saveList(node.left) : undefined);
      addTree(body, 'right', node.right.length ? this.hashCache.get(node.right) || await this.saveList(node.right) : undefined);
      addTree(body, 'bottom', node.bottom.length ? this.hashCache.get(node.bottom) || await this.saveList(node.bottom) : undefined);
      addBlob(body, 'center', node.center ? this.hashCache.get(node.center) || await this.saveNode(node.center) : undefined);
      addBlob(body, 'data', node.data ? this.hashCache.get(node.data) || await this.saveData(node.data) : undefined);

      const hash = await super.saveTree(body);
      this.hashCache.set(node, hash);
      return hash;
    }

    async saveBuddy(node : BuddyNode){
      const body = {};

      addTree(body, 'left', node.left ? this.hashCache.get(node.left) || await this.saveBuddy(node.left) : undefined);
      addTree(body, 'right', node.right ? this.hashCache.get(node.right) || await this.saveBuddy(node.right) : undefined);
      addBlob(body, 'node', await this.saveBuddyLeaf(node));

      const hash = await super.saveTree(body);
      this.hashCache.set(node, hash);
      return hash;
    }

    async saveList(list : EnneaLeaf[]){
      const body = {};

      let i=0;
      for(const item of list){
        addBlob(body, `${i}`, this.hashCache.get(item) || await this.saveNode(item));
        i++;
      }

      const hash = await super.saveTree(body);
      this.hashCache.set(list, hash);
      return hash;
    }

    async saveNode(node : EnneaLeaf){
      const body = JSON.stringify(node);
      const hash = await super.saveText(body);
      this.hashCache.set(node, hash);
      return hash;
    }

    async saveData(data : Item){
      const body = JSON.stringify(data);
      const hash = await super.saveText(body);
      this.hashCache.set(data, hash);
      return hash;
    }

    async saveBuddyLeaf({address, size, usedSize, used, level} : BuddyNode){
      const body = JSON.stringify({address, size, usedSize, used, level});
      return await super.saveText(body);
    }
  }
}

function addTree(obj : { [key : string] : ModeHash}, name : string, hash : string | undefined){
  if(hash){
    obj[name] = {mode: Mode.tree, hash};
  }
}

function addBlob(obj : { [key : string] : ModeHash}, name : string, hash : string | undefined){
  if(hash){
    obj[name] = {mode: Mode.blob, hash};
  }
}
