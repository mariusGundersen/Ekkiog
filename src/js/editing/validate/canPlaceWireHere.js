import * as ennea from 'ennea-tree';

export default function canPlaceWireHere(enneaTree, x, y){
  if(!ennea.isEmpty(enneaTree, {top: y, left: x})) return false;

  return true;
};