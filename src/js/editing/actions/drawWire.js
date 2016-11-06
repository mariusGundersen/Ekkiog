import * as ennea from 'ennea-tree';

import {
  WIRE,
  GROUND
} from '../constants.js';

import {getWireNeighbouringNets} from '../query/getNeighbouringNets.js';
import floodFill from '../flooding/floodFill.js';

export default function drawWire(context, x, y){
  const buddyTree = context.buddyTree;
  const neighbouringNets = getWireNeighbouringNets(context.enneaTree, x, y);

  if(neighbouringNets.length > 1){
    return context;
  }

  const net = neighbouringNets[0] || GROUND;
  const data = {
    type: WIRE,
    net
  };
  const box = {left:x, top:y};
  let enneaTree = ennea.set(context.enneaTree, data, box);

  if(context.enneaTree === enneaTree){
    return context;
  }

  enneaTree = floodFill(enneaTree, net, {...box, data});

  return {
    buddyTree,
    enneaTree
  };
}