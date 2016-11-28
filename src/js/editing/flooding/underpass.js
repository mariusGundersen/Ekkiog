import makePos from './makePos.js';

export default function underpass(oldUnderpass, pos, ctx, queue){
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
