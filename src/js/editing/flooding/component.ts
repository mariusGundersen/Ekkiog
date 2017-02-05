import { Pos, BoxContext } from 'ennea-tree';

import makePos from './makePos.js';

import {
  Context
} from './types';

import {
  Component
} from '../types';

export default function component(oldComponent : Component, pos : Pos, ctx : Context, queue : BoxContext<Context>[]){
  const hitsInput = oldComponent.inputs.some(input => input.x === pos.left && input.y === pos.top);
  if(hitsInput){
    return {
      ...oldComponent,
      inputs: oldComponent.inputs.map(input => input.x === pos.left && input.y === pos.top
        ? {
          ...input,
          net: ctx.net
        }
        : input)
    };
  }

  const output = oldComponent.outputs.filter(output => output.x === pos.left && output.y === pos.top)[0];
  if(output){
    queue.push(makePos(ctx.pos, output.net, output.dx, output.dy));
  }

  return oldComponent;
}
