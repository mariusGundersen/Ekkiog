import {createTree as createEnneaTree} from 'ennea-tree';
import {createTree as createBuddyTree, allocate} from 'buddy-tree';

export default function createForest(){
  return {
    enneaTree: createEnneaTree(128),
    buddyTree: allocate(createBuddyTree(256*256), 2)[0]
  };
}