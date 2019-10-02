import { Pos, BoxContext } from 'ennea-tree';

import {getButtonNet} from '../query/getNetAt';
import {GROUND} from '../constants';
import makePos from './makePos';

import {
  Context
} from './types';

import {
  Button
} from '../types';

export default function button(oldButton : Button, pos : Pos, ctx : Context, queue : BoxContext<Context>[]){
  const net = getButtonNet(
    oldButton,
    pos.left,
    pos.top,
    ctx.pos.left - ctx.prev.left,
    ctx.pos.top - ctx.prev.top);
  if(net !== GROUND && ctx.net === GROUND){
    queue.push(makePos(ctx.pos, net, ctx.prev.left - ctx.pos.left, ctx.prev.top - ctx.pos.top));
  }else if(net !== GROUND && ctx.net !== GROUND && net !== ctx.net){
    throw new Error();
  }

  return oldButton;
}
