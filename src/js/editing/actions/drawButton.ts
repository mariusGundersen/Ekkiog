import {allocate} from 'buddy-tree';

import {
  BUTTON,
  RIGHTWARDS,
  GROUND
} from '../constants';

import {getButtonNeighbouringNets} from '../query/getNeighbouringNets';
import insertItem from './insertItem';

import { Forest, Button, Direction } from '../types';

import {
  directionToDx,
  directionToDy
} from '../utils';

export default function drawButton(forest : Forest, x : number, y : number, direction : Direction = RIGHTWARDS){
  const dx = directionToDx(direction);
  const dy = directionToDy(direction);
  const neighbouringNet = getButtonNeighbouringNets(forest.enneaTree, x, y, dx, dy);

  if(neighbouringNet !== GROUND){
    return forest;
  }

  const {tree: buddyTree, address: net} = allocate(forest.buddyTree);
  const data : Button = {
    type: BUTTON,
    net,
    direction,
    name: ''
  };
  const box = {left:x-1, top:y-1, width:3, height:3};
  return insertItem(forest, buddyTree, data, box);
}