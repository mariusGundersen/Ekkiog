import { Node } from 'ennea-tree';

import {GROUND} from '../constants';

import getNetAt from './getNetAt';

import { EnneaTree } from '../types';

export function getWireNeighbouringNets(enneaTree : EnneaTree, x : number, y : number){
  return unique(
    getLeftRightNet(enneaTree, x, y),
    getAboveBelowNet(enneaTree, x, y));
}

export function getGateNeighbouringNets(enneaTree : EnneaTree, x : number, y : number){
  return unique(getRightNet(enneaTree, x, y));
}

export function getUnderpassNeighbouringNets(enneaTree : EnneaTree, x : number, y : number){
  return {
    horizontal: unique(getLeftRightNet(enneaTree, x, y)),
    vertical: unique(getAboveBelowNet(enneaTree, x, y))
  };
}

export function getButtonNeighbouringNets(enneaTree : EnneaTree, x : number, y : number, dx : number, dy : number){
  return getNetAt(enneaTree, x+dx*2, y+dy*2, dx, dy);
}

export function getLightNeighbouringNet(enneaTree : EnneaTree, x : number, y : number, dx : number, dy : number){
  return getNetAt(enneaTree, x-dx*2, y-dy*2, -dx, -dy);
}

function unique(...iteratorA : IterableIterator<number>[]){
  return iteratorA
    .reduce((a, b) => a.concat(...b), [] as number[])
    .filter(net => net != GROUND)
    .filter((net : number, index : number, nets : number[]) => nets.indexOf(net) === index);
}

function* getLeftRightNet(enneaTree : EnneaTree, x : number, y : number){
  yield getNetAt(enneaTree, x-1, y+0, -1, 0);
  yield getNetAt(enneaTree, x+1, y+0, +1, 0);
}

function* getAboveBelowNet(enneaTree : EnneaTree, x : number, y : number){
  yield getNetAt(enneaTree, x+0, y-1, 0, -1);
  yield getNetAt(enneaTree, x+0, y+1, 0, +1);
}

function* getRightNet(enneaTree : EnneaTree, x : number, y : number){
  yield getNetAt(enneaTree, x+1, y+0, +1, 0);
}