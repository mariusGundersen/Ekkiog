import { Pos, BoxContext } from 'ennea-tree';

import makePos from './makePos';

import {
  Context
} from './types';

import {
  Underpass
} from '../types';

export default function underpass(oldUnderpass : Underpass, pos : Pos, ctx : Context, queue : BoxContext<Context>[]){
  const dx = ctx.pos.left - ctx.prev.left;
  const dy = ctx.pos.top - ctx.prev.top;
  queue.push(makePos(ctx.pos, ctx.net, dx, dy));

  if(dx === 0 && dy !== 0){
    return oldUnderpass;
  }

  return {
    ...oldUnderpass,
    net: ctx.net
  };
}
