import makePos from './makePos.js';
import {getButtonNet} from '../query/getNetAt.js';
import {GROUND} from '../constants.js';

export default function button(oldButton, pos, ctx, queue){
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
