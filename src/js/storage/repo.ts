import { Item, TreeNode, Forest, Box, BuddyNode } from 'ekkiog-editing';
import { BoxedData } from 'ennea-tree';

import modes from 'js-git/lib/modes';
import memDb, { MemDb, TYPE } from 'js-git/mixins/mem-db';
//import createTree from 'js-git/mixins/create-tree';
//import packOps from 'js-git/mixins/pack-ops';
import walkers, { Walkers } from 'js-git/mixins/walkers';
//import readCombiners from 'js-git/mixins/read-combiner';
import formats from 'js-git/mixins/formats';

type TreeLeaf = BoxedData<Item>;

// Create a repo by creating a plain object.
const repo = {} as MemDb & Walkers;

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
walkers(repo);

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

const hashCache = new WeakMap<BuddyNode | TreeNode | TreeLeaf[] | TreeLeaf | Item, HashMode>();

function loadAs<T>(type : TYPE, hash : string){
  return promisify(repo.loadAs<T>(type, hash));
}

export async function checkout(branch : string){
  const hash = await promisify(repo.readRef(branch));
  const commit = await loadAs<{ tree : string }>('commit', hash);

  const tree = await loadAs<any>('tree', commit.tree);
  const forest = await buildTree(await loadAs<any>('tree', tree.ennea.hash));

  console.log(forest);
}

async function buildTree(body : any, size = 128) : Promise<TreeNode | undefined> {
  if(!body) return undefined;

  return {
    size,
    topLeft: body.topLeft ? await buildTree(await loadAs<any>('tree', body.topLeft.hash), size/2) : undefined,
    topRight: body.topRight ? await buildTree(await loadAs<any>('tree', body.topRight.hash), size/2) : undefined,
    bottomLeft: body.bottomLeft ? await buildTree(await loadAs<any>('tree', body.bottomLeft.hash), size/2) : undefined,
    bottomRight: body.bottomRight ? await buildTree(await loadAs<any>('tree', body.bottomRight.hash), size/2) : undefined,
    top: body.top && body.top ? await buildList(await loadAs<any>('tree', body.top.hash)) : [],
    left: body.left && body.left ? await buildList(await loadAs<any>('tree', body.left.hash)) : [],
    right: body.right && body.right ? await buildList(await loadAs<any>('tree', body.right.hash)) : [],
    bottom: body.bottom && body.bottom ? await buildList(await loadAs<any>('tree', body.bottom.hash)) : [],
    center: body.center ? JSON.parse(await loadAs<string>('text', body.center.hash)) : undefined,
    data: body.data ? JSON.parse(await loadAs<string>('text', body.data.hash)) : undefined
  };
}

async function buildList(items : {[key : string] : {hash : string}}) : Promise<TreeLeaf[]> {
  const result = [] as TreeLeaf[];
  for(const item of Object.keys(items)){
    result[parseInt(item)] = JSON.parse(await loadAs<string>('text', items[item].hash));
  }
  return result;
}

export async function commit(branch : string, author : Author, forest : Forest, message : string){
  const tree = await saveForest(forest);
  const result = await promisify(repo.saveAs("commit", {
    author,
    message,
    tree: tree.hash
  }));
  await promisify(repo.updateRef(branch, result));
  return result;
}

async function saveForest({enneaTree, buddyTree} : Forest){
  const dir = {};

  add(dir, 'ennea', enneaTree ? hashCache.get(enneaTree) || await saveEnnea(enneaTree) : undefined);
  add(dir, 'buddy', buddyTree ? hashCache.get(buddyTree) || await saveBuddy(buddyTree) : undefined);

  const hash = await promisify(repo.saveAs(TREE, dir));
  return {hash, mode : TREE};
}

async function saveEnnea(tree : TreeNode,){
  const cached = hashCache.get(tree);
  if(cached) return cached;

  return await saveTree(tree);
}

async function saveTree(node : TreeNode){
  const dir = {};

  add(dir, 'topLeft', node.topLeft ? hashCache.get(node.topLeft) || await saveTree(node.topLeft) : undefined);
  add(dir, 'topRight', node.topRight ? hashCache.get(node.topRight) || await saveTree(node.topRight) : undefined);
  add(dir, 'bottomLeft', node.bottomLeft ? hashCache.get(node.bottomLeft) || await saveTree(node.bottomLeft) : undefined);
  add(dir, 'bottomRight', node.bottomRight ? hashCache.get(node.bottomRight) || await saveTree(node.bottomRight) : undefined);
  add(dir, 'top', node.top.length ? hashCache.get(node.top) || await saveList(node.top) : undefined);
  add(dir, 'left', node.left.length ? hashCache.get(node.left) || await saveList(node.left) : undefined);
  add(dir, 'right', node.right.length ? hashCache.get(node.right) || await saveList(node.right) : undefined);
  add(dir, 'bottom', node.bottom.length ? hashCache.get(node.bottom) || await saveList(node.bottom) : undefined);
  add(dir, 'center', node.center ? hashCache.get(node.center) || await saveNode(node.center) : undefined);
  add(dir, 'data', node.data ? hashCache.get(node.data) || await saveData(node.data) : undefined);

  const hash = await promisify(repo.saveAs(TREE, dir));
  const result = {hash, mode : TREE};
  hashCache.set(node, result);
  return result;
}

async function saveBuddy(node : BuddyNode){
  const dir = {};

  add(dir, 'left', node.left ? hashCache.get(node.left) || await saveBuddy(node.left) : undefined);
  add(dir, 'right', node.right ? hashCache.get(node.right) || await saveBuddy(node.right) : undefined);
  add(dir, 'node', await saveBuddyLeaf(node));

  const hash = await promisify(repo.saveAs(TREE, dir));
  const result = {hash, mode : TREE};
  hashCache.set(node, result);
  return result;
}

async function saveList(list : TreeLeaf[]){
  const dir = {};

  let i=0;
  for(const item of list){
    add(dir, ""+i, hashCache.get(item) || await saveNode(item));
    i++;
  }

  const hash = await promisify(repo.saveAs(TREE, dir));
  const result = {hash, mode : TREE};
  hashCache.set(list, result);
  return result;
}

async function saveNode(node : TreeLeaf){
  const json = JSON.stringify(node);
  const hash = await promisify(repo.saveAs(BLOB, json));
  const result = {hash, mode : BLOB};
  hashCache.set(node, result);
  return result;
}

async function saveData(data : Item){
  const json = JSON.stringify(data);
  const hash = await promisify(repo.saveAs(BLOB, json));
  const result = {hash, mode : BLOB};
  hashCache.set(data, result);
  return result;
}

async function saveBuddyLeaf({address, level, size, used, usedSize} : BuddyNode){
  const json = JSON.stringify({address, level, size, used, usedSize});
  const hash = await promisify<string>(repo.saveAs(BLOB, json));
  return {hash, mode : BLOB};
}

function add(obj : { [key : string] : HashMode}, name : string, hashMode : HashMode | undefined){
  if(hashMode){
    obj[name] = hashMode;
  }
}

function promisify<TV>(f : (callback : (err : any, value : TV) => void) => void) {
  return new Promise<TV>((res, rej) => f((e, v) => e ? rej(e) : res(v)));
}
