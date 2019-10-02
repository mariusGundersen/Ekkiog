import {allocate} from 'buddy-tree';

import {
  GATE} from '../constants';

import getNetAt from '../query/getNetAt';
import {getGateNeighbouringNets} from '../query/getNeighbouringNets';
import insertItem from './insertItem';

import { Forest, Gate } from '../types';

export default function drawGate(forest : Forest, x : number, y : number){
  const neighbouringNets = getGateNeighbouringNets(forest.enneaTree, x, y);

  if(neighbouringNets.length === 1){
    return forest;
  }

  const {tree: buddyTree, address: net} = allocate(forest.buddyTree);
  const data : Gate = {
    type: GATE,
    net,
    inputA: getNetAt(forest.enneaTree, x-4, y-1, -1, 0),
    inputB: getNetAt(forest.enneaTree, x-4, y+1, -1, 0)
  };

  const box = {left:x-3, top:y-1, width:4, height:3};
  return insertItem(forest, buddyTree, data, box);
}