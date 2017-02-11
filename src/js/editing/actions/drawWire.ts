import * as ennea from 'ennea-tree';

import {
  WIRE,
  GROUND
} from '../constants';

import {getWireNeighbouringNets} from '../query/getNeighbouringNets';
import floodFill from '../flooding/floodFill';

import { Forest, Wire } from '../types';

export default function drawWire(forest : Forest, x : number, y : number){
  const buddyTree = forest.buddyTree;
  const neighbouringNets = getWireNeighbouringNets(forest.enneaTree, x, y);

  if(neighbouringNets.length > 1){
    return forest;
  }

  const net = neighbouringNets[0] || GROUND;
  const data = {
    type: WIRE,
    net
  } as Wire;
  const box = {left:x, top:y};
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
    buddyTree,
    enneaTree
  };
}