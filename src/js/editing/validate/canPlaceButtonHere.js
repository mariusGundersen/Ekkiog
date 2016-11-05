import * as ennea from 'ennea-tree';

import getNetAt from '../query/getNetAt.js';

const GROUND = 0;

export default function canPlaceButtonHere(enneaTree, x, y){
  const nextTileNet = getNetAt(enneaTree, y+1, x+4);
  if(nextTileNet !== GROUND) return false;

  return true;
};