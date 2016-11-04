import makePos from './makePos.js';

export default function button(oldButton, pos, ctx, queue){
  if(pos.left === 2 && pos.top === 1){
    if(ctx.prev.left - ctx.pos.left === 1 && ctx.prev.top === ctx.pos.top){
      queue.push(makePos(ctx.pos, oldButton.net, 1, 0));
    }
  }

  return oldButton;
}
