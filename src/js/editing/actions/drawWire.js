import * as ennea from 'ennea-tree';

import {
  WIRE,
  GROUND
} from '../constants.js';

import {getWireNeighbouringNets} from '../query/getNeighbouringNets.js';
import floodFill from '../flooding/floodFill.js';

export default function drawWire(forest, x, y){
  const buddyTree = forest.buddyTree;
  const neighbouringNets = getWireNeighbouringNets(forest.enneaTree, x, y);

  if(neighbouringNets.length > 1){
    return forest;
  }

  const net = neighbouringNets[0] || GROUND;
  const data = {
    type: WIRE,
    net
  };
  const box = {left:x, top:y};
  let enneaTree = ennea.set(forest.enneaTree, data, box);

  if(forest.enneaTree === enneaTree){
    return forest;
  }

  enneaTree = floodFill(enneaTree, net, {...box, data});

  return {
    buddyTree,
    enneaTree
  };
}