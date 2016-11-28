import makePos from './makePos.js';

export default function gate(oldGate, pos, ctx, queue){
  if(pos.left === 3 && pos.top === 1){
    if(ctx.prev.left - ctx.pos.left === 1 && ctx.prev.top === ctx.pos.top){
      queue.push(makePos(ctx.pos, oldGate.net, 1, 0));
    }
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
