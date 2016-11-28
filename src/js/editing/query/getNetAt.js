import * as ennea from 'ennea-tree';

import {
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,
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
  }
}

export function getGateNet(gate, dx, dy){
  if(gate.top === 1 && gate.left === 3){
    return gate.data.net;
  }else if(gate.top === 0 && gate.left === 0 && dx === 1 && dy === 0){
    return gate.data.inputA.net;
  }else if(gate.top === 2 && gate.left === 0 && dx === 1 && dy === 0){
    return gate.data.inputB.net;
  }else{
    return GROUND;
  }
}

export function getUnderpassNet(underpass, dx, dy, enneaTree, x, y){
  if(dx !== 0 && dy === 0){
    return underpass.data.net;
  }else{
    return getNetAt(enneaTree, x, y+dy, dx, dy);
  }
}

export function getButtonNet(button){
  if(button.top === 1 && button.left === 2){
    return button.data.net;
  }else{
    return GROUND;
  }
}