import {
  update,
  Node,
  BoxContext,
  Pos
} from 'ennea-tree';

import {
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,
  COMPONENT,
  GROUND
} from '../constants';
import makePos from './makePos';

import wire from './wire';
import gate from './gate';
import underpass from './underpass';
import button from './button';
import component from './component';

import {
  TreeNode
} from '../types';

import {
  Context,
  FloodSource,
  FloodSourceButton,
  FloodSourceComponent,
  FloodSourceGate,
  FloodSourceUnderpass,
  FloodSourceWire
} from './types';

export default function floodFill(enneaTree : TreeNode, ...floodSources : FloodSource[]) : TreeNode {

  const queue = [...make(floodSources)];
  const updater = update(enneaTree, (old, ctx : Context, pos) => {
    switch(old.type){
      case WIRE:
        return wire(old, pos, ctx, queue);
      case GATE:
        return gate(old, pos, ctx, queue);
      case UNDERPASS:
        return underpass(old, pos, ctx, queue);
      case BUTTON:
        return button(old, pos, ctx, queue);
      case COMPONENT:
        return component(old, pos, ctx, queue);
      default:
        return old;
    }
  });

  return updater.result(queue);
}

export function* make(floodSources : FloodSource[]) : IterableIterator<BoxContext<Context>>{
  for(const floodSource of floodSources){
    switch(floodSource.type){
      case WIRE:
        yield makePos({top: floodSource.top, left: floodSource.left}, floodSource.net, 0, 1);
        yield makePos({top: floodSource.top, left: floodSource.left}, floodSource.net, 1, 0);
        yield makePos({top: floodSource.top, left: floodSource.left}, floodSource.net, 0, -1);
        yield makePos({top: floodSource.top, left: floodSource.left}, floodSource.net, -1, 0);
        break;
      case GATE:
        yield makePos({top: floodSource.top+1, left: floodSource.left+3}, floodSource.net, 1, 0);
        break;
      case UNDERPASS:
        yield makePos({top: floodSource.top, left: floodSource.left}, floodSource.net, 1, 0);
        yield makePos({top: floodSource.top, left: floodSource.left}, floodSource.net, -1, 0);
        yield makePos({top: floodSource.top, left: floodSource.left}, GROUND, 0, 1);
        yield makePos({top: floodSource.top, left: floodSource.left}, GROUND, 0, -1);
        break;
      case BUTTON:
        yield makePos({top: floodSource.top+1, left: floodSource.left+2}, floodSource.net, 1, 0);
        break;
      case COMPONENT:
        yield makePos({top: floodSource.top, left: floodSource.left}, floodSource.net, floodSource.dx, floodSource.dy);
        break;
    }
  }
}
