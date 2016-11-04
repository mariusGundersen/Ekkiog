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

export default function set(context, change){
  switch(change.after.type){
    case 'wire':
      return wire(context, change, change.after);
    case 'gate':
      return gate(context, change, change.after);
    case 'button':
      return button(context, change, change.after);
  }
}

export function wire(context, {top:y, left:x}, wire){
  setMap(context, x, y, WIRE);
  setNetMap(context, x, y, wire.net);
}

export function gate(context, {top:y, left:x, width, height}, gate){
  setMap(context, x+3, y+1, GATE);
  setNetMap(context, x+3, y+1, gate.net);
  setNetMap(context, x+0, y+0, gate.inputA.net);
  setNetMap(context, x+0, y+2, gate.inputB.net);
  setGate(context, gate.net, gate.inputA.net, gate.inputB.net);
}

export function button(context, {top:y, left:x, width, height}, button){
  setMap(context, x+2, y+1, BUTTON);
  setNetMap(context, x+2, y+1, button.net);
  setNetMap(context, x+1, y+1, button.net);
  setGate(context, button.net, button.state, button.state);
}