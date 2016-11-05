import * as ennea from 'ennea-tree';

import getNetAt from '../query/getNetAt.js';

const GROUND = 0;

export default function canPlaceUnderpassHere(enneaTree, x, y){
  if(!ennea.isEmpty(enneaTree, {top: y, left: x})) return false;

  return true;
};