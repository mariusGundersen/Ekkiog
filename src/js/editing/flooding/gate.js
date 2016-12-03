import makePos from './makePos.js';
import {getGateNet} from '../query/getNetAt.js';
import {GROUND} from '../constants.js';

export default function gate(oldGate, pos, ctx, queue){
  const net = getGateNet(
    oldGate,
    pos.left,
    pos.top,
    ctx.pos.left - ctx.prev.left,
    ctx.pos.top - ctx.prev.top);
  if(net != GROUND){
    queue.push(makePos(ctx.pos, net, 1, 0));
  }

  if(pos.left !== 0 || pos.top === 1){
    return oldGate;
  }

  if(ctx.pos.left - ctx.prev.left !== 1 || ctx.pos.top !== ctx.prev.top){
    return oldGate;
  }

  const input = pos.top === 0 ? 'inputA' : 'inputB';

  if(oldGate[input].net === ctx.net){
    return oldGate;
  }

  return {
    ...oldGate,
    [input]: {
      ...oldGate[input],
      net: ctx.net
    }
  };
}
