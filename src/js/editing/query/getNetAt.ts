import { get, Node } from 'ennea-tree';

import {
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,
  COMPONENT,
  GROUND
} from '../constants';

import {
  TreeNode,
  Wire,
  Gate,
  Underpass,
  Button,
  Component
} from '../types';

export default function getNetAt(enneaTree : TreeNode, x : number, y : number, dx : number, dy : number){
  const tile = get(enneaTree, y, x);
  if(!tile || !tile.data) return GROUND;

  switch(tile.data.type){
    case WIRE:
      return tile.data.net;
    case GATE:
      return getGateNet(tile.data, tile.left, tile.top, dx, dy);
    case UNDERPASS:
      return getUnderpassNet(tile.data, dx, dy, enneaTree, x, y);
    case BUTTON:
      return getButtonNet(tile.data, tile.left, tile.top, dx, dy);
    case COMPONENT:
      return getComponentNet(tile.data, tile.left, tile.top, dx, dy);
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

export function getUnderpassNet(underpass : Underpass, dx : number, dy : number, enneaTree : TreeNode, x : number, y : number) : number{
  if(dx !== 0 && dy === 0){
    return underpass.net;
  }else{
    return getNetAt(enneaTree, x, y+dy, dx, dy);
  }
}

export function getButtonNet(button : Button, x : number, y : number, dx : number, dy : number){
  if(x === 2 && y === 1 && dx === -1 && dy === 0){
    return button.net;
  }else{
    return GROUND;
  }
}

export function getComponentNet(component : Component, x : number, y : number, dx : number, dy : number){
  const output = component.outputs.filter(output => output.x === x && output.y === y)[0];
  if(output && output.dx === -dx && output.dy === -dy){
    return output.net;
  }else{
    return GROUND;
  }
}