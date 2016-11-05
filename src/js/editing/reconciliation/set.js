import {
  setMap,
  setNetMap,
  setGate
} from './mutateContext.js';

import {
  EMPTY_TILE,
  WIRE_TILE,
  GATE_TILE,
  UNDERPASS_TILE,
  BUTTON_TILE
} from '../tileConstants.js';

import {
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,
  GROUND
} from '../constants.js';

export default function set(context, change){
  switch(change.after.type){
    case WIRE:
      return wire(context, change, change.after);
    case GATE:
      return gate(context, change, change.after);
    case UNDERPASS:
      return underpass(context, change, change.after);
    case BUTTON:
      return button(context, change, change.after);
  }
}

export function wire(context, {top:y, left:x}, wire){
  setMap(context, x, y, WIRE_TILE);
  setNetMap(context, x, y, wire.net);
}

export function gate(context, {top:y, left:x, width, height}, gate){
  setMap(context, x+3, y+1, GATE_TILE);
  setNetMap(context, x+3, y+1, gate.net);
  setNetMap(context, x+0, y+0, gate.inputA.net);
  setNetMap(context, x+0, y+2, gate.inputB.net);
  setGate(context, gate.net, gate.inputA.net, gate.inputB.net);
}

export function underpass(context, {top:y, left:x}, underpass){
  setMap(context, x, y, UNDERPASS_TILE);
  setNetMap(context, x, y, underpass.net);
}

export function button(context, {top:y, left:x, width, height}, button){
  console.log('set button', BUTTON_TILE);
  setMap(context, x+2, y+1, BUTTON_TILE);
  setNetMap(context, x+2, y+1, button.net);
  setNetMap(context, x+1, y+1, button.net);
  const state = button.state ? 0 : 1;
  setGate(context, button.net, state, state);
}