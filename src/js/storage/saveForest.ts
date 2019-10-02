import { Item, EnneaTree, Forest, BuddyTree } from '../editing';
import { BoxedData } from 'ennea-tree';

import { Constructor, IRawRepo, Mode, Hash } from '@es-git/core';
import { IObjectRepo, Person, ModeHash } from '@es-git/object-mixin';
import { ISaveAsRepo } from '@es-git/save-as-mixin';


export interface User {
  readonly name : string
  readonly email : string
};

export interface ISaveForestRepo {
  commit(branch : string, author : User, forest : Forest, message : string, name : string) : Promise<string>
}

type EnneaLeaf = BoxedData<Item>;

export default function mixin<T extends Constructor<IRawRepo & IObjectRepo & ISaveAsRepo>>(repo : T) : Constructor<ISaveForestRepo> & T {
  return class SaveForestRepo extends repo implements ISaveForestRepo {
    private readonly hashCache : WeakMap<BuddyTree | EnneaTree | EnneaLeaf[] | EnneaLeaf | Item, Hash>
    constructor(...args : any[]){
      super(...args);
      this.hashCache = new WeakMap<BuddyTree | EnneaTree | EnneaLeaf[] | EnneaLeaf | Item, Hash>();
    }

    async commit(branch : string, person : User, forest : Forest, message : string, name : string){
      const parentHash = await super.getRef(branch);
      return this.saveAndCommit(branch, person, forest, message, parentHash ? [parentHash] : [], name);
    }

    async saveAndCommit(branch : string, person : User, forest : Forest, message : string, parents : Hash[], name : string){
      const tree = await this.saveForest(forest, name);

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

    async saveForest({enneaTree, buddyTree} : Forest, name : string){
      const body = {};

      const [ennea, buddy, readme] = await Promise.all([
        enneaTree ? this.saveEnnea(enneaTree) : undefined,
        buddyTree ? this.saveBuddy(buddyTree) : undefined,
        this.saveReadme(name)
      ] as any[]);

      addTree(body, 'ennea', ennea);
      addTree(body, 'buddy', buddy);
      addBlob(body, 'readme.md', readme);

      const hash = await super.saveTree(body);
      return {hash, mode : Mode.tree};
    }

    async saveEnnea(node : EnneaTree){
      const cached = this.hashCache.get(node);
      if(cached) return cached;

      const item = await Promise.all([
        node.data ? this.saveData(node.data) : undefined,
        node.topLeft ? this.saveEnnea(node.topLeft) : undefined,
        node.top.length ? this.saveList(node.top) : undefined,
        node.topRight ? this.saveEnnea(node.topRight) : undefined,
        node.left.length ? this.saveList(node.left) : undefined,
        node.center ? this.saveNode(node.center) : undefined,
        node.right.length ? this.saveList(node.right) : undefined,
        node.bottomLeft ? this.saveEnnea(node.bottomLeft) : undefined,
        node.bottom.length ? this.saveList(node.bottom) : undefined,
        node.bottomRight ? this.saveEnnea(node.bottomRight) : undefined
      ] as any[]);

      const body = {};

      addBlob(body, '0', item[0]);
      addTree(body, '1', item[1]);
      addTree(body, '2', item[2]);
      addTree(body, '3', item[3]);
      addTree(body, '4', item[4]);
      addBlob(body, '5', item[5]);
      addTree(body, '6', item[6]);
      addTree(body, '7', item[7]);
      addTree(body, '8', item[8]);
      addTree(body, '9', item[9]);

      const hash = await super.saveTree(body);
      this.hashCache.set(node, hash);
      return hash;
    }

    async saveBuddy(node : BuddyTree){
      const cached = this.hashCache.get(node);
      if(cached) return cached;

      const [d, l, r] = await Promise.all([
        this.saveBuddyLeaf(node),
        node.left ? this.saveBuddy(node.left) : undefined,
        node.right ? this.saveBuddy(node.right) : undefined
      ] as any[]);

      const body = {};

      addBlob(body, 'd', d);
      addTree(body, 'l', l);
      addTree(body, 'r', r);

      const hash = await super.saveTree(body);
      this.hashCache.set(node, hash);
      return hash;
    }

    async saveList(list : EnneaLeaf[]){
      const cached = this.hashCache.get(list);
      if(cached) return cached;

      const body = {};

      let i=0;
      for(const item of await Promise.all(list.map(item => this.saveNode(item)))){
        addBlob(body, `${i}`, item);
        i++;
      }

      const hash = await super.saveTree(body);
      this.hashCache.set(list, hash);
      return hash;
    }

    async saveNode(node : EnneaLeaf){
      const cached = this.hashCache.get(node);
      if(cached) return cached;

      const body = JSON.stringify(node);
      const hash = await super.saveText(body);
      this.hashCache.set(node, hash);
      return hash;
    }

    async saveData(data : Item){
      const cached = this.hashCache.get(data);
      if(cached) return cached;

      const body = JSON.stringify(data);
      const hash = await super.saveText(body);
      this.hashCache.set(data, hash);
      return hash;
    }

    async saveBuddyLeaf({address, size, usedSize, used, level} : BuddyTree){
      const body = JSON.stringify({address, size, usedSize, used, level});
      return await super.saveText(body);
    }

    async saveReadme(name : string){
      return await super.saveText(`# ${name}

## [Try it out](https://ekkiog.mariusgundersen.net/)

This is a component made using [Ekkiog](https://ekkiog.mariusgundersen.net), a mobile webapp for building logic circuits`);
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
