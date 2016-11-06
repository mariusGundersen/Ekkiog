import * as ennea from 'ennea-tree';
import {allocate} from 'buddy-tree';

import {
  GATE,
  GROUND
} from '../constants.js';

import {getGateNeighbouringNets} from '../query/getNeighbouringNets.js';
import floodFill from '../flooding/floodFill.js';

export default function drawGate(context, x, y){
  const neighbouringNets = getGateNeighbouringNets(context.enneaTree, x, y);

  if(neighbouringNets.length === 1){
    return context;
  }

  const [buddyTree, net] = allocate(context.buddyTree);
  const inputA = ennea.get(context.enneaTree, y-1, x-4);
  const inputB = ennea.get(context.enneaTree, y+1, x-4);
  const data = {
    type: GATE,
    net,
    inputA: {
      net: inputA ? inputA.data.net : GROUND
    },
    inputB: {
      net: inputB ? inputB.data.net : GROUND
    }
  };
  const box = {left:x-3, top:y-1, width:4, height:3};
  let enneaTree = ennea.set(context.enneaTree, data, box);

  if(context.enneaTree === enneaTree){
    return context;
  }

  enneaTree = floodFill(enneaTree, net, {...box, data});

  return {
    enneaTree,
    buddyTree
  };
}