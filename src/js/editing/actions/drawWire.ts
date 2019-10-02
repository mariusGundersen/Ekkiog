import {
  WIRE,
  GROUND
} from '../constants';

import { getWireNeighbouringNets } from '../query/getNeighbouringNets';
import insertItem from './insertItem';

import { Forest, Wire } from '../types';

export default function drawWire(forest: Forest, x: number, y: number) {
  const buddyTree = forest.buddyTree;
  const neighbouringNets = getWireNeighbouringNets(forest.enneaTree, x, y);

  if (neighbouringNets.length > 1) {
    return forest;
  }

  const net = neighbouringNets[0] || GROUND;
  const data = makeWire(net);
  const box = { left: x, top: y };
  return insertItem(forest, buddyTree, data, box);
}

export const makeWire = (net: number): Wire => ({
  type: WIRE,
  net
});
