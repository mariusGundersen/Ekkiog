import * as ennea from 'ennea-tree';
import {allocate} from 'buddy-tree';

import {
  BUTTON
} from '../constants.js';

import {getButtonNeighbouringNets} from '../query/getNeighbouringNets.js';
import floodFill from '../flooding/floodFill.js';

export default function drawButton(forest, x, y){
  const neighbouringNets = getButtonNeighbouringNets(forest.enneaTree, x, y);

  if(neighbouringNets.length === 1){
    return forest;
  }

  const [buddyTree, net] = allocate(forest.buddyTree);
  const data = {
    type: BUTTON,
    net,
    state: false
  };
  const box = {left:x-2, top:y-1, width:3, height:3};
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
