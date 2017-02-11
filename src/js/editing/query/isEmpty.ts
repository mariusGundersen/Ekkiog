import { isEmpty as isItEmpty, Node } from 'ennea-tree';

import { TreeNode } from '../types';

export default function isEmpty(enneaTree : TreeNode, top : number, left : number, right : number, bottom : number){
  return isItEmpty(enneaTree, {top, left, right, bottom});
}