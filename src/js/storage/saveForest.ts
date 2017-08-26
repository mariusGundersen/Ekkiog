import { Item, TreeNode as EnneaNode, Forest, Box, BuddyNode } from 'ekkiog-editing';
import { BoxedData } from 'ennea-tree';

import { Constructor, IRawRepo, Type, Mode, Hash } from '@es-git/core';
import { IObjectRepo, Person, ModeHash, TreeBody, CommitBody, textToBlob } from '@es-git/object-mixin';
import { ISaveAsRepo } from '@es-git/save-as-mixin';

export interface ISaveForestRepo {
  commit(branch : string, author : Person, forest : Forest, message : string) : Promise<string>
  create(branch : string, author : Person, forest : Forest, message : string) : Promise<string>
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
      return this.saveAndCommit(branch, person, forest, message, [parentHash]);
    }

    async create(branch : string, person : {name : string, email : string}, forest : Forest, message : string){
      return this.saveAndCommit(branch, person, forest, message, []);
    }

    async saveAndCommit(branch : string, person : {name : string, email : string}, forest : Forest, message : string, parents : Hash[]){
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
        parents
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

      addBlob(body, '0', node.data ? this.hashCache.get(node.data) || await this.saveData(node.data) : undefined);
      addTree(body, '1', node.topLeft ? this.hashCache.get(node.topLeft) || await this.saveEnnea(node.topLeft) : undefined);
      addTree(body, '2', node.top.length ? this.hashCache.get(node.top) || await this.saveList(node.top) : undefined);
      addTree(body, '3', node.topRight ? this.hashCache.get(node.topRight) || await this.saveEnnea(node.topRight) : undefined);
      addTree(body, '4', node.left.length ? this.hashCache.get(node.left) || await this.saveList(node.left) : undefined);
      addBlob(body, '5', node.center ? this.hashCache.get(node.center) || await this.saveNode(node.center) : undefined);
      addTree(body, '6', node.right.length ? this.hashCache.get(node.right) || await this.saveList(node.right) : undefined);
      addTree(body, '7', node.bottomLeft ? this.hashCache.get(node.bottomLeft) || await this.saveEnnea(node.bottomLeft) : undefined);
      addTree(body, '8', node.bottom.length ? this.hashCache.get(node.bottom) || await this.saveList(node.bottom) : undefined);
      addTree(body, '9', node.bottomRight ? this.hashCache.get(node.bottomRight) || await this.saveEnnea(node.bottomRight) : undefined);

      const hash = await super.saveTree(body);
      this.hashCache.set(node, hash);
      return hash;
    }

    async saveBuddy(node : BuddyNode){
      const body = {};

      addBlob(body, 'd', await this.saveBuddyLeaf(node));
      addTree(body, 'l', node.left ? this.hashCache.get(node.left) || await this.saveBuddy(node.left) : undefined);
      addTree(body, 'r', node.right ? this.hashCache.get(node.right) || await this.saveBuddy(node.right) : undefined);

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
