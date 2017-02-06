import { Node } from 'ennea-tree';

import {GROUND} from '../constants';

import getNetAt from './getNetAt';

import { TreeNode } from '../types';

export function getWireNeighbouringNets(enneaTree : TreeNode, x : number, y : number){
  return unique(
    getLeftRightNet(enneaTree, x, y),
    getAboveBelowNet(enneaTree, x, y));
}

export function getGateNeighbouringNets(enneaTree : TreeNode, x : number, y : number){
  return unique(getRightNet(enneaTree, x, y));
}

export function getUnderpassNeighbouringNets(enneaTree : TreeNode, x : number, y : number){
  return {
    horizontal: unique(getLeftRightNet(enneaTree, x, y)),
    vertical: unique(getAboveBelowNet(enneaTree, x, y))
  };
}

export function getButtonNeighbouringNets(enneaTree : TreeNode, x : number, y : number){
  return unique(getRightNet(enneaTree, x, y));
}

function unique(...iteratorA : IterableIterator<number>[]){
  return iteratorA
    .reduce((a, b) => a.concat(...b), [] as number[])
    .filter(net => net != GROUND)
    .filter((net, index, nets) => nets.indexOf(net) === index);
}

function* getNetAroundWire(enneaTree : TreeNode, x : number, y : number){
  yield* getLeftRightNet(enneaTree, x, y);
  yield* getAboveBelowNet(enneaTree, x, y);
}

function* getLeftRightNet(enneaTree : TreeNode, x : number, y : number){
  yield getNetAt(enneaTree, x-1, y+0, -1, 0);
  yield getNetAt(enneaTree, x+1, y+0, +1, 0);
}

function* getAboveBelowNet(enneaTree : TreeNode, x : number, y : number){
  yield getNetAt(enneaTree, x+0, y-1, 0, -1);
  yield getNetAt(enneaTree, x+0, y+1, 0, +1);
}

function* getRightNet(enneaTree : TreeNode, x : number, y : number){
  yield getNetAt(enneaTree, x+1, y+0, +1, 0);
}