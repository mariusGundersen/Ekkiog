import {
  update
} from 'ennea-tree';

export default function floodFill(enneaTree, net, pos, dx=0, dy=0){
  const changes = [
    makePos(pos, dx, dy)
  ];

  const updater = update(enneaTree, (old, ctx, pos) => {
    switch(old.type){
      case 'wire':
        return floodWire(old, ctx, changes, fillWire(old, net));
      case 'gate':
        return fillGate(old, pos, ctx, net);
      default:
        return old;
    }
  });

  return updater.result(changes);
}

function fillWire(old, net){
  if(old.net === net){
    return old;
  }

  return {
    ...old,
    net
  };
}

function floodWire(oldWire, ctx, changes, newWire){
  if(oldWire !== newWire){
    pushPosToChanges(changes, ctx.pos, ctx.prev, -1, 0);
    pushPosToChanges(changes, ctx.pos, ctx.prev, +1, 0);
    pushPosToChanges(changes, ctx.pos, ctx.prev, 0, -1);
    pushPosToChanges(changes, ctx.pos, ctx.prev, 0, +1);
  }

  return newWire;
}

function fillGate(old, pos, ctx, net){
  if(pos.left !== 0 || pos.top === 1){
    return old;
  }

  if(ctx.pos.left - ctx.prev.left !== 1 || ctx.pos.top !== ctx.prev.top){
    return old;
  }

  const input = pos.top === 0 ? 'inputA' : 'inputB';

  if(old[input].net === net){
    return old;
  }

  return {
    ...old,
    [input]: {
      ...old[input],
      net
    }
  };
}

function pushPosToChanges(changes, pos, prev, dx, dy){
  if(pos.left+dx != prev.left || pos.top+dy != prev.top){
    changes.push(makePos(pos, dx, dy));
  }
}

function makePos({top, left}, dx, dy){
  return {
    area: {
      top: top+dy,
      left: left+dx
    },
    context: {
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