import * as ennea from 'ennea-tree';

export default function canPlaceWireHere(context, x, y){
  if(!ennea.isEmpty(context.enneaTree, {top: y, left: x})) return false;

  return true;
};