import { ChangeSet, Area } from 'ennea-tree';

import {
  setMap,
  setNetMap,
  setGate,
  setGateA,
  setGateB
} from './mutateContext.js';

import {
  EMPTY_TILE,
  WIRE_TILE,
  UNDERPASS_TILE,
  GATE_TILE,
  BUTTON_TILE,
  COMPONENT_TILE,
  tile
} from './tileConstants.js';

import {
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,
  GROUND,
  COMPONENT
} from '../constants.js';

import { Item, Wire, Gate, Underpass, Button, Component, Context } from '../types';

export default function set(context : Context, change : ChangeSet<Item>){
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

export function wire(context : Context, {top:y, left:x} : Area, wire : Wire){
  setMap(context, x, y, WIRE_TILE);
  setNetMap(context, x, y, wire.net);
}

export function gate(context : Context, {top:y, left:x, width, height} : Area, gate : Gate){
  for(let ty=0; ty<height; ty++){
    for(let tx=0; tx<width; tx++){
      setMap(context, tx+x, ty+y, gateTile(tx, ty));
    }
  }
  setNetMap(context, x+3, y+1, gate.net);
  setNetMap(context, x+0, y+0, gate.inputA);
  setNetMap(context, x+0, y+2, gate.inputB);
  setGate(context, gate.net, gate.inputA, gate.inputB);
}

export function underpass(context : Context, {top:y, left:x} : Area, underpass : Underpass){
  setMap(context, x, y, UNDERPASS_TILE);
  setNetMap(context, x, y, underpass.net);
}

export function button(context : Context, {top:y, left:x, width, height} : Area, button : Button){
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

export function component(context : Context, {top:y, left:x, width, height} : Area, component : Component){
  const ports = [...component.inputs, ...component.outputs];

  for(let ty=0; ty<height; ty++){
    for(let tx=0; tx<width; tx++){
      setMap(context, tx+x, ty+y, componentTile(tx, ty, width-1, height-1, ports));
    }
  }

  for(const gate of component.gates){
    setGate(context, gate.net, gate.inputA, gate.inputB);
  }

  for(const input of component.inputs){
    setNetMap(context, x+input.x, y+input.y, input.net);
    for(const pointer of input.pointsTo){
      if(pointer.input === 'A'){
        setGateA(context, pointer.net, input.net);
      }else{
        setGateB(context, pointer.net, input.net);
      }
    }
  }

  for(const output of component.outputs){
    setNetMap(context, x+output.x, y+output.y, output.net);
  }
}

export function gateTile(x : number, y : number){
  return GATE_TILE + tile(x, y);
}

export function buttonTile(x : number, y : number){
  return BUTTON_TILE + tile(x, y);
}

export function componentTile(x : number, y : number, w : number, h : number, ports : {x : number, y : number}[]){
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