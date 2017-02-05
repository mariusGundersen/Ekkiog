import { Pos, BoxContext } from 'ennea-tree';

import {getButtonNet} from '../query/getNetAt.js';
import {GROUND} from '../constants.js';
import makePos from './makePos.js';

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
  if(net != GROUND){
    queue.push(makePos(ctx.pos, net, 1, 0));
  }

  return oldButton;
}
