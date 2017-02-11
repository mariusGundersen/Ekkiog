import * as ennea from 'ennea-tree';
import {allocate} from 'buddy-tree';

import {
  GATE,
  GROUND
} from '../constants';

import getNetAt from '../query/getNetAt';
import {getGateNeighbouringNets} from '../query/getNeighbouringNets';
import floodFill from '../flooding/floodFill';

import { Forest, TreeNode, Gate } from '../types';

export default function drawGate(forest : Forest, x : number, y : number){
  const neighbouringNets = getGateNeighbouringNets(forest.enneaTree, x, y);

  if(neighbouringNets.length === 1){
    return forest;
  }

  const {tree: buddyTree, address: net} = allocate(forest.buddyTree);
  const data = {
    type: GATE,
    net,
    inputA: getNetAt(forest.enneaTree, x-4, y-1, 0, -1),
    inputB: getNetAt(forest.enneaTree, x-4, y+1, 0, -1)
  } as Gate;
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