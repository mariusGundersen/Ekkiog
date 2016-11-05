import {
  setMap,
  setNetMap,
  setGate
} from './mutateContext.js';

import {
  EMPTY,
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON
} from '../tileConstants.js';

const GROUND = 0;

export default function clear(context, change){
  clearArea(context, change);
  switch(change.before.type){
    case 'wire':
      return;
    case 'gate':
      return setGate(context, change.before.net, 0, 0);
    case 'underpass':
      return;
    case 'button':
      return setGate(context, change.before.net, 0, 0);
  }
}

export function clearArea(context, {top, left, width, height}){
  for(let y=top; y<top+height; y++){
    for(let x=left; x<left+width; x++){
      setMap(context, x, y, EMPTY);
      setNetMap(context, x, y, GROUND);
    }
  }
}