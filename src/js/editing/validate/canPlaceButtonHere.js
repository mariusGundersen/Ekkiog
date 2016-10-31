import * as ennea from 'ennea-tree';

import getNetAt from '../query/getNetAt.js';

const GROUND = 0;

export default function canPlaceButtonHere(enneaTree, x, y){
  if(!ennea.isEmpty(enneaTree, {top: y, left: x, width:3, height:3})) return false;

  const nextTileNet = getNetAt(enneaTree, y+1, x+4);
  if(nextTileNet !== GROUND) return false;

  return true;
};