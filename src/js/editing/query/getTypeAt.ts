import { get, Node, AreaData } from 'ennea-tree';

import {
  EMPTY
} from '../constants';

import { EnneaTree, TileType } from '../types';

export default function getTypeAt(enneaTree : EnneaTree, x : number, y : number) : TileType {
  const tile = get(enneaTree, y, x);

  return tile && tile.data && tile.data.type || EMPTY;
}