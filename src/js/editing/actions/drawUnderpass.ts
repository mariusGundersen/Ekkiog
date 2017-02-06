import * as ennea from 'ennea-tree';

import {
  UNDERPASS,
  GROUND
} from '../constants';

import {getUnderpassNeighbouringNets} from '../query/getNeighbouringNets';
import floodFill from '../flooding/floodFill';

import { Forest, Underpass } from '../types';

export default function drawUnderpass(forest : Forest, x : number, y : number){
  const buddyTree = forest.buddyTree;
  const neighbouringNets = getUnderpassNeighbouringNets(forest.enneaTree, x, y);

  if(neighbouringNets.horizontal.length > 1 || neighbouringNets.vertical.length > 1){
    return forest;
  }

  const net = neighbouringNets.horizontal[0] || GROUND;
  const data = {
    type: UNDERPASS,
    net
  } as Underpass;
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
