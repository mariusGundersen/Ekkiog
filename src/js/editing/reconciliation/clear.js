import {
  setMap,
  setNetMap,
  setGate
} from './mutateContext.js';

import {
  EMPTY_TILE
} from './tileConstants.js';

import {
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,
  COMPONENT,
  GROUND
} from '../constants.js';

export default function clear(context, change){
  clearArea(context, change);
  switch(change.before.type){
    case WIRE:
      return;
    case GATE:
      return setGate(context, change.before.net, GROUND, GROUND);
    case UNDERPASS:
      return;
    case BUTTON:
      return setGate(context, change.before.net, GROUND, GROUND);
    case COMPONENT:
      return clearComponent(context, change.before);
  }
}

export function clearArea(context, {top, left, width, height}){
  for(let y=top; y<top+height; y++){
    for(let x=left; x<left+width; x++){
      setMap(context, x, y, EMPTY_TILE);
      setNetMap(context, x, y, GROUND);
    }
  }
}

export function clearComponent(context, component){
  //clear all gates
}