import * as ennea from 'ennea-tree';
import {deallocate} from 'buddy-tree';

import {
  GATE,
  BUTTON,
  COMPONENT,
  GROUND
} from '../constants.js';

import floodFill from '../flooding/floodFill.js';

export default function clear(forest, x, y){
  let [enneaTree, ...cleared] = ennea.clear(forest.enneaTree, {left:x, top:y});

  enneaTree = floodFill(enneaTree, ...cleared.reduce((a, b) => [...a, ...clearBox(b)], []));

  const buddyTree = cleared.map(getNetSource)
    .filter(net => net > 1)
    .reduce(deallocate, forest.buddyTree);

  return {
    enneaTree,
    buddyTree
  };
}

function* clearBox(box){
  if(box.data.type === COMPONENT){
    for(const output of box.data.outputs){
      yield {
        left: box.left + output.x,
        top: box.top + output.y,
        type: box.data.type,
        net: GROUND
      };
    }
  }

  return yield {
    left: box.left,
    top: box.top,
    type: box.data.type,
    net: GROUND
  };
}

function getNetSource(box){
  switch(box.data.type){
    case GATE:
    case BUTTON:
      return box.data.net;
    case COMPONENT:
      return box.data.nets[0]
    default:
      return -1;
  }
}