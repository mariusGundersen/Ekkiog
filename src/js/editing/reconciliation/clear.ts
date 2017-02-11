import { ChangeClear, Area } from 'ennea-tree';

import {
  setMap,
  setNetMap,
  setGate
} from './mutateContext';

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

import { Item, Component, Context } from '../types';

export default function clear(context : Context, change : ChangeClear<Item>){
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

export function clearArea(context : Context, {top, left, width, height} : Area){
  for(let y=top; y<top+height; y++){
    for(let x=left; x<left+width; x++){
      setMap(context, x, y, EMPTY_TILE);
      setNetMap(context, x, y, GROUND);
    }
  }
}

export function clearComponent(context : Context, component : Component){
  //clear all gates
}