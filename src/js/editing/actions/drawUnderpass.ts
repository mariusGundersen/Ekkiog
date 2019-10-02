import {
  UNDERPASS,
  GROUND
} from '../constants';

import {getUnderpassNeighbouringNets} from '../query/getNeighbouringNets';
import insertItem from './insertItem';

import { Forest, Underpass } from '../types';

export default function drawUnderpass(forest : Forest, x : number, y : number){
  const buddyTree = forest.buddyTree;
  const neighbouringNets = getUnderpassNeighbouringNets(forest.enneaTree, x, y);

  if(neighbouringNets.horizontal.length > 1 || neighbouringNets.vertical.length > 1){
    return forest;
  }

  const net = neighbouringNets.horizontal[0] || GROUND;
  const data : Underpass = {
    type: UNDERPASS,
    net
  };
  const box = {left:x, top:y};
  return insertItem(forest, buddyTree, data, box);
}
