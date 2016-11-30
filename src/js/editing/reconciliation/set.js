import {
  setMap,
  setNetMap,
  setGate
} from './mutateContext.js';

import {
  EMPTY_TILE,
  WIRE_TILE,
  UNDERPASS_TILE,
  GATE_TILE,
  BUTTON_TILE,
  COMPONENT_TILE
} from './tileConstants.js';

import {
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,
  GROUND,
  COMPONENT
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
    case COMPONENT:
      return component(context, change, change.after);
  }
}

export function wire(context, {top:y, left:x}, wire){
  setMap(context, x, y, WIRE_TILE);
  setNetMap(context, x, y, wire.net);
}

export function gate(context, {top:y, left:x, width, height}, gate){
  for(let ty=0; ty<height; ty++){
    for(let tx=0; tx<width; tx++){
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
  for(let ty=0; ty<height; ty++){
    for(let tx=0; tx<width; tx++){
      setMap(context, tx+x, ty+y, buttonTile(tx, ty));
    }
  }
  setNetMap(context, x+2, y+1, button.net);
  setNetMap(context, x+1, y+1, button.net);
  const state = button.state ? 0 : 1;
  setGate(context, button.net, state, state);
}

export function component(context, {top:y, left:x, width, height}, component){
  const gates = component.gates;

  const ports = [...component.inputs, ...component.outputs];

  for(let ty=0; ty<height; ty++){
    for(let tx=0; tx<width; tx++){
      setMap(context, tx+x, ty+y, componentTile(tx, ty, width-1, height-1, ports));
    }
  }

  for(const input of component.inputs){
    setNetMap(context, x+input.x, y+input.y, input.net);
  }

  for(const output of component.outputs){
    setNetMap(context, x+output.x, y+output.y, output.net);
  }
}

export function gateTile(x, y){
  return GATE_TILE + tile(x, y);
}

export function buttonTile(x, y){
  return BUTTON_TILE + tile(x, y);
}

export function componentTile(x, y, w, h, ports){
  if(x === 0){
    if(y === 0){
      return COMPONENT_TILE + tile(0, 0);
    }else if(y === h){
      return COMPONENT_TILE + tile(0, 3);
    }else if(ports.some(p => p.x === x && p.y === y)){
      return COMPONENT_TILE + tile(0, 1);
    }else {
      return COMPONENT_TILE + tile(0, 2);
    }
  }else if(x === w){
    if(y === 0){
      return COMPONENT_TILE + tile(3, 0);
    }else if(y === h){
      return COMPONENT_TILE + tile(3, 3);
    }else if(ports.some(p => p.x === x && p.y === y)){
      return COMPONENT_TILE + tile(3, 2);
    }else{
      return COMPONENT_TILE + tile(3, 1);
    }
  }else{
    if(y === 0){
      if(ports.some(p => p.x === x && p.y === y)){
        return COMPONENT_TILE + tile(2, 0);
      }else{
        return COMPONENT_TILE + tile(1, 0);
      }
    }else if(y === h){
      if(ports.some(p => p.x === x && p.y === y)){
        return COMPONENT_TILE + tile(1, 3);
      }else{
        return COMPONENT_TILE + tile(2, 3);
      }
    }else{
      return COMPONENT_TILE + tile(1, 1);
    }
  }
}