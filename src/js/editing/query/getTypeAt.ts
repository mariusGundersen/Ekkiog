import { get, Node, AreaData } from 'ennea-tree';

import {
  EMPTY
} from '../constants';

import { TreeNode } from '../types';

export default function getTypeAt(enneaTree : TreeNode, x : number, y : number){
  const tile = get(enneaTree, y, x);

  return tile && tile.data && tile.data.type || EMPTY;
}