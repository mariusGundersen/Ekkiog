import {
  update
} from 'ennea-tree';

export default function floodFill(enneaTree, net, pos){
  const changes = [
    {area: pos, context: {pos, prev: pos}}
  ];

  const updater = update(enneaTree, (old, ctx, pos) => {
    switch(old.type){
      case 'wire':
        return floodWire(old, ctx, changes, fillWire(old, net));
      case 'gate':
        return fillGate(old, pos, net);
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

function fillGate(old, pos, net){
  console.log('fillGate', pos);
  if(pos.left !== 0 || pos.top === 1){
    return old;
  }

  const input = pos.top === 0 ? 'inputA' : 'inputB';
  console.log('fillGate', old, input, net);

  if(old[input].net === net){
    return old;
  }

  console.log('filGate', old[input]);
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