import * as ennea from 'ennea-tree';

const GROUND = 0;

export default function canPlaceGateHere(enneaTree, x, y){
  if(!ennea.isEmpty(enneaTree, {top: y, left: x, width:4, height:3})) return false;

  const nextTile = ennea.get(enneaTree, y+1, x+4);
  if(nextTile && nextTile.data && nextTile.data.net !== GROUND) return false;

  return true;
};