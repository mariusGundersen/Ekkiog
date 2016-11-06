import * as ennea from 'ennea-tree';

import {
  WIRE,
  UNDERPASS,
  GROUND
} from '../constants.js';

import {getUnderpassNeighbouringNets} from '../query/getNeighbouringNets.js';
import floodFill from '../flooding/floodFill.js';

export default function drawUnderpass(context, x, y){
  const buddyTree = context.buddyTree;
  const neighbouringNets = getUnderpassNeighbouringNets(context.enneaTree, x, y);

  if(neighbouringNets.horizontal.length > 1 || neighbouringNets.vertical.length > 1){
    return context;
  }

  const net = neighbouringNets.horizontal[0] || GROUND;
  const data = {
    type: UNDERPASS,
    net
  };
  const box = {left:x, top:y};

  let enneaTree = ennea.set(context.enneaTree, data, box);

  if(context.enneaTree === enneaTree){
    return context;
  }

  enneaTree = ennea.set(enneaTree, {type:WIRE, net: GROUND}, {left:x, top:y-1});
  enneaTree = ennea.set(enneaTree, {type:WIRE, net: GROUND}, {left:x, top:y+1});

  enneaTree = floodFill(enneaTree, net, {...box, data});

  return {
    buddyTree,
    enneaTree
  };
}
