import * as ennea from 'ennea-tree';
import {allocate} from 'buddy-tree';

import {
  BUTTON
} from '../constants.js';

import {getButtonNeighbouringNets} from '../query/getNeighbouringNets.js';
import floodFill from '../flooding/floodFill.js';

import { Forest, Button } from '../types';

export default function drawButton(forest : Forest, x : number, y : number){
  const neighbouringNets = getButtonNeighbouringNets(forest.enneaTree, x, y);

  if(neighbouringNets.length === 1){
    return forest;
  }

  const [buddyTree, net] = allocate(forest.buddyTree);
  const data = {
    type: BUTTON,
    net,
    state: false
  } as Button;
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
