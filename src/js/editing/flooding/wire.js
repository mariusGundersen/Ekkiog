import makePos from './makePos.js';

export default function wire(oldWire, pos, ctx, queue){
  if(oldWire.net === ctx.net){
    return oldWire;
  }

  pushPosToChanges(queue, ctx, -1, 0);
  pushPosToChanges(queue, ctx, +1, 0);
  pushPosToChanges(queue, ctx, 0, -1);
  pushPosToChanges(queue, ctx, 0, +1);

  return {
    ...oldWire,
    net: ctx.net
  };
}

function pushPosToChanges(queue, ctx, dx, dy){
  if(ctx.pos.left+dx != ctx.prev.left || ctx.pos.top+dy != ctx.prev.top){
    queue.push(makePos(ctx.pos, ctx.net, dx, dy));
  }
}
