import * as ennea from 'ennea-tree';

import {
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,
  COMPONENT,
  GROUND
} from '../constants.js';

export default function getNetAt(enneaTree, x, y, dx, dy){
  const tile = ennea.get(enneaTree, y, x);
  if(!tile) return GROUND;

  switch(tile.data.type){
    case WIRE:
      return tile.data.net;
    case GATE:
      return getGateNet(tile, dx, dy);
    case UNDERPASS:
      return getUnderpassNet(tile, dx, dy, enneaTree, x, y);
    case BUTTON:
      return getButtonNet(tile);
    case COMPONENT:
      return getComponentNet(tile, dx, dy)
  }
}

export function getGateNet(tile, dx, dy){
  if(tile.top === 1 && tile.left === 3){
    return tile.data.net;
  }else if(tile.top === 0 && tile.left === 0 && dx === 1 && dy === 0){
    return tile.data.inputA.net;
  }else if(tile.top === 2 && tile.left === 0 && dx === 1 && dy === 0){
    return tile.data.inputB.net;
  }else{
    return GROUND;
  }
}

export function getUnderpassNet(tile, dx, dy, enneaTree, x, y){
  if(dx !== 0 && dy === 0){
    return tile.data.net;
  }else{
    return getNetAt(enneaTree, x, y+dy, dx, dy);
  }
}

export function getButtonNet(tile){
  if(tile.top === 1 && tile.left === 2){
    return tile.data.net;
  }else{
    return GROUND;
  }
}

export function getComponentNet(tile, dx, dy){
  //TODO: add all directions
  const output = tile.data.outputs.filter(output => output.x === tile.left && output.y === tile.top)[0];
  if(output){
    return output.net;
  }else{
    return GROUND;
  }
}