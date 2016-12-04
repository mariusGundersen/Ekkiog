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
      return getGateNet(tile.data, tile.left, tile.top, dx, dy);
    case UNDERPASS:
      return getUnderpassNet(tile, dx, dy, enneaTree, x, y);
    case BUTTON:
      return getButtonNet(tile.data, tile.left, tile.top, dx, dy);
    case COMPONENT:
      return getComponentNet(tile, dx, dy)
  }
}

export function getGateNet(gate, x, y, dx, dy){
  if(x === 3 && y === 1 && dx === -1 && dy === 0){
    return gate.net;
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

export function getButtonNet(button, x, y, dx, dy){
  if(x === 2 && y === 1 && dx === -1 && dy === 0){
    return button.net;
  }else{
    return GROUND;
  }
}

export function getComponentNet(tile, dx, dy){
  const output = tile.data.outputs.filter(output => output.x === tile.left && output.y === tile.top)[0];
  if(output && output.dx === -dx && output.dy === -dy){
    return output.net;
  }else{
    return GROUND;
  }
}