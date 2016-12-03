import makePos from './makePos.js';

export default function component(oldComponent, pos, ctx, queue){
  const hitsInput = oldComponent.inputs.some(input => input.x === pos.left && input.y === pos.top);
  if(hitsInput){
    return {
      ...oldComponent,
      inputs: oldComponent.inputs.map(input => input.x === pos.left && input.y === pos.top
        ? {
          x: input.x,
          y: input.y,
          net: ctx.net
        }
        : input)
    };
  }

  const output = oldComponent.outputs.filter(output => output.x === pos.left && output.y === pos.top)[0];
  if(output){
    //TODO: fix for all directions
    queue.push(makePos(ctx.pos, output.net, 1, 0));
  }

  return oldComponent;
}
