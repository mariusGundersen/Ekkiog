import { ChangeClear, Area } from 'ennea-tree';

import {
  EMPTY_TILE
} from './tileConstants';

import {
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,
  COMPONENT,
  GROUND
} from '../constants';

import { Item, Component, MutableContext, Button, Gate } from '../types';

export default function clear(context : MutableContext, change : ChangeClear<Item>){
  clearArea(context, change);
  switch(change.before.type){
    case WIRE:
    case UNDERPASS:
      return;
    case GATE:
    case BUTTON:
      return clearGate(context, change.before);
    case COMPONENT:
      return clearComponent(context, change.before);
  }
}

export function clearArea(context : MutableContext, {top, left, width, height} : Area){
  for(let y=top; y<top+height; y++){
    for(let x=left; x<left+width; x++){
      context.setMap(x, y, EMPTY_TILE);
      context.setNet(x, y, GROUND);
    }
  }
}

export function clearGate(context : MutableContext, item : Button | Gate){
  context.clearGate(item.net);
}

export function clearComponent(context : MutableContext, component : Component){
  context.removeText(component);

  for(const index of component.package.gates.map((_, index) => index)){
    context.clearGate(component.net + index);
  }
}