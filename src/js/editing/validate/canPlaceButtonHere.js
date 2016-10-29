import * as ennea from 'ennea-tree';

const GROUND = 0;

export default function canPlaceButtonHere(context, x, y){
  if(!ennea.isEmpty(context.enneaTree, {top: y, left: x, width:3, height:3})) return false;

  if(!context.netMapTexture.get(x+3, y+1) === GROUND) return false;

  return true;
};