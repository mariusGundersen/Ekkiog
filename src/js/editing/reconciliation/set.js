import {
  setMap,
  setNetMap,
  setGate
} from './mutateContext.js';

import {
  EMPTY_TILE,
  WIRE_TILE,
  gateTile,
  UNDERPASS_TILE,
  buttonTile
} from './tileConstants.js';

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
  for(let ty=0; ty<3; ty++){
    for(let tx=0; tx<4; tx++){
      setMap(context, tx+x, ty+y, gateTile(tx, ty));
    }
  }
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
  for(let ty=0; ty<3; ty++){
    for(let tx=0; tx<3; tx++){
      setMap(context, tx+x, ty+y, buttonTile(tx, ty));
    }
  }
  setNetMap(context, x+2, y+1, button.net);
  setNetMap(context, x+1, y+1, button.net);
  const state = button.state ? 0 : 1;
  setGate(context, button.net, state, state);
}