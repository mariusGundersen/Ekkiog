import * as ennea from 'ennea-tree';

const GROUND = 0;

export default function canPlaceGateHere(context, x, y){
  if(!ennea.isEmpty(context.enneaTree, {top: y, left: x, width:4, height:3})) return false;

  if(!context.netMapTexture.get(x+4, y+1) === GROUND) return false;

  return true;
};