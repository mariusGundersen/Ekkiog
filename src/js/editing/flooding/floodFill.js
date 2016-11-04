import {
  update
} from 'ennea-tree';

import makePos from './makePos.js';

import wire from './wire.js';
import gate from './gate.js';
import button from './button.js';

export default function floodFill(enneaTree, net, ...changes){

  const queue = [...make(net, ...changes)];
  const updater = update(enneaTree, (old, ctx, pos) => {
    switch(old.type){
      case 'wire':
        return wire(old, pos, ctx, queue);
      case 'gate':
        return gate(old, pos, ctx, queue);
      case 'button':
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
      case 'wire':
        yield makePos({top: box.top, left: box.left}, net, 0, 1);
        yield makePos({top: box.top, left: box.left}, net, 1, 0);
        yield makePos({top: box.top, left: box.left}, net, 0, -1);
        yield makePos({top: box.top, left: box.left}, net, -1, 0);
        break;
      case 'gate':
        yield makePos({top: box.top+1, left: box.left+3}, net, 1, 0);
        break;
      case 'button':
        yield makePos({top: box.top+1, left: box.left+2}, net, 1, 0);
        break;
    }
  }
}
