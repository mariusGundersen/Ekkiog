import * as ennea from 'ennea-tree';
import {allocate} from 'buddy-tree';

import {
  GATE,
  GROUND
} from '../constants.js';

import getNetAt from '../query/getNetAt.js';
import {getGateNeighbouringNets} from '../query/getNeighbouringNets.js';
import floodFill from '../flooding/floodFill.js';

export default function drawGate(forest, x, y){
  const neighbouringNets = getGateNeighbouringNets(forest.enneaTree, x, y);

  if(neighbouringNets.length === 1){
    return forest;
  }

  const [buddyTree, net] = allocate(forest.buddyTree);
  const data = {
    type: GATE,
    net,
    inputA: {
      net: getNetAt(forest.enneaTree, x-4, y-1, 0, -1)
    },
    inputB: {
      net: getNetAt(forest.enneaTree, x-4, y+1, 0, -1)
    }
  };
  const box = {left:x-3, top:y-1, width:4, height:3};
  let enneaTree = ennea.set(forest.enneaTree, data, box);

  if(forest.enneaTree === enneaTree){
    return forest;
  }

  enneaTree = floodFill(enneaTree, {
    left: box.left,
    top: box.top,
    type: data.type,
    net: data.net
  });

  return {
    enneaTree,
    buddyTree
  };
}