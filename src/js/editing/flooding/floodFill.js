import {
  update
} from 'ennea-tree';

import {
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,
  GROUND
} from '../constants.js';
import makePos from './makePos.js';

import wire from './wire.js';
import gate from './gate.js';
import underpass from './underpass.js';
import button from './button.js';

export default function floodFill(enneaTree, net, ...changes){

  const queue = [...make(net, ...changes)];
  const updater = update(enneaTree, (old, ctx, pos) => {
    switch(old.type){
      case WIRE:
        return wire(old, pos, ctx, queue);
      case GATE:
        return gate(old, pos, ctx, queue);
      case UNDERPASS:
        return underpass(old, pos, ctx, queue);
      case BUTTON:
        return button(old, pos, ctx, queue);
      default:
        return old;
    }
  });

  return updater.result(queue);
}

export function* make(net, ...boxes){
  for(const box of boxes){
    switch(box.data.type){
      case WIRE:
        yield makePos({top: box.top, left: box.left}, net, 0, 1);
        yield makePos({top: box.top, left: box.left}, net, 1, 0);
        yield makePos({top: box.top, left: box.left}, net, 0, -1);
        yield makePos({top: box.top, left: box.left}, net, -1, 0);
        break;
      case GATE:
        yield makePos({top: box.top+1, left: box.left+3}, net, 1, 0);
        break;
      case UNDERPASS:
        yield makePos({top: box.top, left: box.left}, net, 1, 0);
        yield makePos({top: box.top, left: box.left}, net, -1, 0);
        yield makePos({top: box.top, left: box.left}, GROUND, 0, 1);
        yield makePos({top: box.top, left: box.left}, GROUND, 0, -1);
        break;
      case BUTTON:
        yield makePos({top: box.top+1, left: box.left+2}, net, 1, 0);
        break;
    }
  }
}
