import * as ennea from 'ennea-tree';

import {
  WIRE,
  UNDERPASS,
  GROUND
} from '../constants.js';

import {getUnderpassNeighbouringNets} from '../query/getNeighbouringNets.js';
import floodFill from '../flooding/floodFill.js';

export default function drawUnderpass(forest, x, y){
  const buddyTree = forest.buddyTree;
  const neighbouringNets = getUnderpassNeighbouringNets(forest.enneaTree, x, y);

  if(neighbouringNets.horizontal.length > 1 || neighbouringNets.vertical.length > 1){
    return forest;
  }

  const net = neighbouringNets.horizontal[0] || GROUND;
  const data = {
    type: UNDERPASS,
    net
  };
  const box = {left:x, top:y};

  let enneaTree = ennea.set(forest.enneaTree, data, box);

  if(forest.enneaTree === enneaTree){
    return forest;
  }

  enneaTree = ennea.set(enneaTree, {type:WIRE, net: GROUND}, {left:x, top:y-1});
  enneaTree = ennea.set(enneaTree, {type:WIRE, net: GROUND}, {left:x, top:y+1});

  enneaTree = floodFill(enneaTree, net, {...box, data});

  return {
    buddyTree,
    enneaTree
  };
}
