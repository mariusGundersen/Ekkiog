import * as ennea from 'ennea-tree';
import {allocate} from 'buddy-tree';

import {
  BUTTON
} from '../constants.js';

import {getButtonNeighbouringNets} from '../query/getNeighbouringNets.js';
import floodFill from '../flooding/floodFill.js';

export default function drawButton(context, x, y){
  const neighbouringNets = getButtonNeighbouringNets(context.enneaTree, x, y);

  if(neighbouringNets.length === 1){
    return context;
  }

  const [buddyTree, net] = allocate(context.buddyTree);
  const data = {
    type: BUTTON,
    net,
    state: false
  };
  const box = {left:x-2, top:y-1, width:3, height:3};
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
