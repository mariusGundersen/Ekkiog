import * as memory from '../editing/memory.js';

export function createMemoryTree(size){
  const tree = createFromSize(size);
  memory.allocate(tree);//ground
  memory.allocate(tree);//charge
  return tree;
}

export function createFromSize(size, address=0){
  return createFromLevel(log2(size), address);
}

export function createFromLevel(level, address=0){
  return {
    used: false,
    left: null,
    right: null,
    level: level,
    size: 1<<level,
    address: address
  };
}

export function log2(x){
  return Math.ceil(Math.log(x)/Math.LN2);
}
