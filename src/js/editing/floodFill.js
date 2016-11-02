import {
  update
} from 'ennea-tree';

export default function floodFill(enneaTree, ...changes){
  const updater = update(enneaTree, (old, ctx, pos) => {
    switch(old.type){
      case 'wire':
        return floodWire(old, ctx, changes, fillWire(old, ctx));
      case 'gate':
        return fillGate(old, pos, ctx);
      default:
        return old;
    }
  });

  return updater.result(changes);
}

function fillWire(old, ctx){
  if(old.net === ctx.net){
    return old;
  }

  return {
    ...old,
    net: ctx.net
  };
}

function floodWire(oldWire, ctx, changes, newWire){
  if(oldWire !== newWire){
    pushPosToChanges(changes, ctx, -1, 0);
    pushPosToChanges(changes, ctx, +1, 0);
    pushPosToChanges(changes, ctx, 0, -1);
    pushPosToChanges(changes, ctx, 0, +1);
  }

  return newWire;
}

function fillGate(old, pos, ctx){
  if(pos.left !== 0 || pos.top === 1){
    return old;
  }

  if(ctx.pos.left - ctx.prev.left !== 1 || ctx.pos.top !== ctx.prev.top){
    return old;
  }

  const input = pos.top === 0 ? 'inputA' : 'inputB';

  if(old[input].net === ctx.net){
    return old;
  }

  return {
    ...old,
    [input]: {
      ...old[input],
      net: ctx.net
    }
  };
}

function pushPosToChanges(changes, ctx, dx, dy){
  if(ctx.pos.left+dx != ctx.prev.left || ctx.pos.top+dy != ctx.prev.top){
    changes.push(makePos(ctx.pos, ctx.net, dx, dy));
  }
}

export function makePos({top, left}, net, dx=0, dy=0){
  return {
    area: {
      top: top+dy,
      left: left+dx
    },
    context: {
      net,
      pos: {
        top: top+dy,
        left: left+dx
      },
      prev: {
        top,
        left
      }
    }
  };
}