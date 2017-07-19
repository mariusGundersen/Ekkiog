import {
  Forest,
  Item,
  WIRE,
  UNDERPASS,
  GATE,
  BUTTON,
  LIGHT,
  COMPONENT,
  GROUND
} from 'ekkiog-editing';
import {
  set,
  Area
} from 'ennea-tree';
import {
  createNode,
  Node as BuddyTree,
  Allocation
} from 'buddy-tree';

export default function copyTo(forest : Forest, item : Item, area : Area) : Forest {
  const nets = getAllocation(item);
  return {
    enneaTree: set(forest.enneaTree, item, area),
    buddyTree: allocate(forest.buddyTree, nets[0], nets.length).tree
  };
}

export function allocate(tree : BuddyTree, address : number, size : number) : Allocation{
  if(tree.size < size || tree.used){
    return {
      tree,
      address: -1,
      count: 0,
      size: 0
    };
  }

  if(tree.size/2 < size){
    if(tree.left === null && tree.right === null){
      return {
        tree : {
          ...tree,
          usedSize: size,
          used: true
        },
        address: tree.address,
        count: size,
        size: tree.size
      };
    }else{
      return {
        tree,
        address: -1,
        count: 0,
        size: 0
      };
    }
  }

  if(address < tree.size/2){
    const {tree: left, address: _, size: allocatedSize, count} = allocate(tree.left || createNode(tree.size/2, tree.address), address, size);
    return {
      tree: {
        ...tree,
        used: left.used && tree.right != null && tree.right.used,
        usedSize: left.usedSize + (tree.right != null ? tree.right.usedSize || 0 : 0),
        left,
        right: tree.right
      },
      address,
      count,
      size: allocatedSize
    };
  }else{
    const {tree: right, address: _, size: allocatedSize, count} = allocate(tree.right || createNode(tree.size/2, tree.address + tree.size/2), address - tree.size/2, size);
    return {
      tree: {
        ...tree,
        used: right.used && tree.left != null && tree.left.used,
        usedSize: right.usedSize + (tree.left != null ? tree.left.usedSize || 0 : 0),
        left: tree.left,
        right
      },
      address: address + tree.size/2,
      count,
      size: allocatedSize
    };
  }
}

export function getAllocation(item : Item){
  switch(item.type){
    case GATE:
    case BUTTON:
    case LIGHT:
      return [item.net];
    case COMPONENT:
      return item.nets;
    default:
      return [GROUND];
  }
}