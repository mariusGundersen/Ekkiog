import { Pos, BoxContext } from 'ennea-tree';

import {getGateNet} from '../query/getNetAt';
import {GROUND} from '../constants';
import makePos from './makePos';

import {
  Context
} from './types';

import {
  Gate
} from '../types';

export default function gate(oldGate : Gate, pos : Pos, ctx : Context, queue : BoxContext<Context>[]){
  const net = getGateNet(
    oldGate,
    pos.left,
    pos.top,
    ctx.pos.left - ctx.prev.left,
    ctx.pos.top - ctx.prev.top);
  if(net !== GROUND && ctx.net === GROUND){
    queue.push(makePos(ctx.pos, net, 1, 0));
  }else if(net !== GROUND && ctx.net !== GROUND && net !== ctx.net){
    throw new Error();
  }

  if(pos.left !== 0 || pos.top === 1){
    return oldGate;
  }

  if(ctx.pos.left - ctx.prev.left !== 1 || ctx.pos.top !== ctx.prev.top){
    return oldGate;
  }

  const input = pos.top === 0 ? 'inputA' : 'inputB';

  if(oldGate[input] === ctx.net){
    return oldGate;
  }

  return {
    ...oldGate,
    [input]: ctx.net
  };
}
