import * as ennea from 'ennea-tree';
import * as buddy from 'buddy-tree';

import { Forest, EnneaTree } from '../types';
export default function createForest(buddyTree = createBuddyTree(), enneaTree = createEnneaTree()) : Forest {
  return {
    enneaTree,
    buddyTree
  };
}

export function createEnneaTree() {
  return ennea.createTree(128) as EnneaTree;
}

export function createBuddyTree() {
  const tree = buddy.createTree(256 * 256);
  return buddy.allocate(tree, 2).tree;
}
