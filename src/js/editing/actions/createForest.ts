import {createTree as createEnneaTree} from 'ennea-tree';
import {createTree as createBuddyTree, allocate} from 'buddy-tree';

import { Forest, TreeNode } from '../types';

export default function createForest() : Forest{
  return {
    enneaTree: createEnneaTree(128) as TreeNode,
    buddyTree: allocate(createBuddyTree(256*256), 2).tree
  };
}