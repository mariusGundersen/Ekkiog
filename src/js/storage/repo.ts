import { Item, TreeNode, Forest, Box } from 'ekkiog-editing';
import { BoxedData } from 'ennea-tree';

import modes from 'js-git/lib/modes';
import memDb, { MemDb } from 'js-git/mixins/mem-db';
//import createTree from 'js-git/mixins/create-tree';
//import packOps from 'js-git/mixins/pack-ops';
//import walkers from 'js-git/mixins/walkers';
//import readCombiners from 'js-git/mixins/read-combiner';
import formats from 'js-git/mixins/formats';

type TreeLeaf = BoxedData<Item>;

// Create a repo by creating a plain object.
const repo = {} as MemDb;

// This provides an in-memory storage backend that provides the following APIs:
// - saveAs(type, value) => hash
// - loadAs(type, hash) => hash
// - saveRaw(hash, binary) =>
// - loadRaw(hash) => binary
memDb(repo);

// This adds a high-level API for creating multiple git objects by path.
// - createTree(entries) => hash
//createTree(repo);

// This provides extra methods for dealing with packfile streams.
// It depends on
// - unpack(packStream, opts) => hashes
// - pack(hashes, opts) => packStream
//packOps(repo);

// This adds in walker algorithms for quickly walking history or a tree.
// - logWalk(ref|hash) => stream<commit>
// - treeWalk(hash) => stream<object>
//walkers(repo);

// This combines parallel requests for the same resource for effeciency under load.
//readCombiners(repo);

// This makes the object interface less strict.  See it's docs for details
formats(repo);

type HashMode = {
  readonly mode : 'tree' | 'blob';
  readonly hash : string;
}

type Author = {
  readonly name : string;
  readonly email : string;
}

const BLOB : 'blob' = 'blob';
const TREE : 'tree' = 'tree';

const hashCache = new WeakMap<TreeNode | TreeLeaf[] | TreeLeaf | Item, HashMode>();

export async function commit(author : Author, forest : Forest, message : string){
  const tree = await saveEnnea(forest.enneaTree);
  const result = await promisify(repo.saveAs("commit", {
    author,
    message,
    tree: tree.hash
  }));
  return result;
}

let indent = '';

async function saveEnnea(tree : TreeNode){
  const cached = hashCache.get(tree);
  if(cached) return cached;

  console.log('-> saveEnnea');
  const result = await saveTree(tree, 'root');
  console.log('<- saveEnnea', result.hash);
  return result;
}

async function saveTree(node : TreeNode, name : string){
  indent = indent+' ';
  console.log(indent, '-> saveTree', name);

  const dir = {};
  add(dir, 'topLeft', node.topLeft ? hashCache.get(node.topLeft) || await saveTree(node.topLeft, 'topLeft') : undefined);
  add(dir, 'topRight', node.topRight ? hashCache.get(node.topRight) || await saveTree(node.topRight, 'topRight') : undefined);
  add(dir, 'bottomLeft', node.bottomLeft ? hashCache.get(node.bottomLeft) || await saveTree(node.bottomLeft, 'bottomLeft') : undefined);
  add(dir, 'bottomRight', node.bottomRight ? hashCache.get(node.bottomRight) || await saveTree(node.bottomRight, 'bottomRight') : undefined);
  add(dir, 'top', node.top.length ? hashCache.get(node.top) || await saveList(node.top, 'top') : undefined);
  add(dir, 'left', node.left.length ? hashCache.get(node.left) || await saveList(node.left, 'left') : undefined);
  add(dir, 'right', node.right.length ? hashCache.get(node.right) || await saveList(node.right, 'right') : undefined);
  add(dir, 'bottom', node.bottom.length ? hashCache.get(node.bottom) || await saveList(node.bottom, 'bottom') : undefined);
  add(dir, 'center', node.center ? hashCache.get(node.center) || await saveNode(node.center, 'center') : undefined);
  add(dir, 'data', node.data ? hashCache.get(node.data) || await saveData(node.data, 'data') : undefined);

  const hash = await promisify<string>(repo.saveAs(TREE, dir));
  const result = {hash, mode : TREE};
  hashCache.set(node, result);
  console.log(indent, '<- saveTree', hash);
  indent = indent.substr(1);
  return result;
}

async function saveList(list : TreeLeaf[], name : string){
  indent = indent+' ';
  console.log(indent, '-> saveList', name);
  const dir = {};

  let i=0;
  for(const item of list){
    add(dir, ""+i, hashCache.get(item) || await saveNode(item, ""+i));
    i++;
  }

  const hash = await promisify<string>(repo.saveAs(TREE, dir));
  const result = {hash, mode : TREE};
  hashCache.set(list, result);
  console.log(indent, '<- saveList', hash);
  indent = indent.substr(1);
  return result;
}

async function saveNode(node : TreeLeaf, name : string){
  indent = indent+' ';
  console.log(indent, '-> saveNode', name);
  const json = JSON.stringify(node);
  console.log(indent, json);
  const hash = await promisify<string>(repo.saveAs(BLOB, json));
  const result = {hash, mode : BLOB};
  hashCache.set(node, result);
  console.log(indent, '<- saveNode', hash);
  indent = indent.substr(1);
  return result;
}

async function saveData(data : Item, name : string){
  indent = indent+' ';
  console.log(indent, '-> saveData');
  const json = JSON.stringify(data);
  console.log(indent, json);
  const hash = await promisify<string>(repo.saveAs(BLOB, json));
  const result = {hash, mode : BLOB};
  hashCache.set(data, result);
  console.log(indent, '<- saveData', hash);
  indent = indent.substr(1);
  return result;
}

function add(obj : { [key : string] : HashMode}, name : string, hashMode : HashMode | undefined){
  if(hashMode){
    obj[name] = hashMode;
  }
}

function promisify<TV>(f : (callback : (err : any, value : TV) => void) => void) {
  return new Promise<TV>((res, rej) => f((e, v) => e ? rej(e) : res(v)));
}
