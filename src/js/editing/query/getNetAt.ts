import { get } from 'ennea-tree';

import {
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,
  COMPONENT,
  GROUND
} from '../constants';

import {
  EnneaTree,
  Gate,
  Underpass,
  Button,
  Component} from '../types';

export default function getNetAt(enneaTree : EnneaTree, x : number, y : number, dx : number, dy : number){
  const tile = get(enneaTree, y, x);
  if(!tile || !tile.data) return GROUND;

  switch(tile.data.type){
    case WIRE:
      return tile.data.net;
    case GATE:
      return getGateNet(tile.data, x-tile.left, y-tile.top, dx, dy);
    case UNDERPASS:
      return getUnderpassNet(tile.data, dx, dy, enneaTree, x, y);
    case BUTTON:
      return getButtonNet(tile.data, x-tile.left, y-tile.top, dx, dy);
    case COMPONENT:
      return getComponentNet(tile.data, x-tile.left, y-tile.top, dx, dy);
    default:
      return GROUND;
  }
}

export function getGateNet(gate : Gate, x : number, y : number, dx : number, dy : number){
  if(x === 3 && y === 1 && dx === -1 && dy === 0){
    return gate.net;
  }else{
    return GROUND;
  }
}

export function getUnderpassNet(underpass : Underpass, dx : number, dy : number, enneaTree : EnneaTree, x : number, y : number) : number{
  if(dx !== 0 && dy === 0){
    return underpass.net;
  }else{
    return getNetAt(enneaTree, x, y+dy, dx, dy);
  }
}

export function getButtonNet(button : Button, x : number, y : number, dx : number, dy : number){
  switch(button.direction){
    case 'upwards':
      return (x === 1 && y === 0 && dx === 0 && dy === 1)
        ? button.net
        : GROUND;
    case 'downwards':
      return (x === 1 && y === 2 && dx === 0 && dy === -1)
        ? button.net
        : GROUND;
    case 'leftwards':
      return (x === 0 && y === 1 && dx === 1 && dy === 0)
        ? button.net
        : GROUND;
    case 'rightwards':
    default:
      return (x === 2 && y === 1 && dx === -1 && dy === 0)
        ? button.net
        : GROUND;
  }
}

export function getComponentNet(component : Component, x : number, y : number, dx : number, dy : number){
  const index = component.package.outputs.findIndex(output => output.x === x && output.y === y && output.dx === -dx && output.dy === -dy);
  if(index >= 0){
    return component.outputs[index].net;
  }

  const input = component.package.inputs.find(input => input.x === x && input.y === y && input.dx === -dx && input.dy === -dy);
  if(input){
    return component.inputs[input.group].net;
  }

  return GROUND;
}