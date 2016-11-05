import getNetAt from '../query/getNetAt.js';

const GROUND = 0;

export function getWireNeighbouringNets(enneaTree, x, y){
  return unique(
    getLeftRightNet(enneaTree, x, y),
    getAboveBelowNet(enneaTree, x, y));
}

export function getGateNeighbouringNets(enneaTree, x, y){
  return unique(getRightNet(enneaTree, x, y));
}

export function getUnderpassNeighbouringNets(enneaTree, x, y){
  return {
    horizontal: unique(getLeftRightNet(enneaTree, x, y)),
    vertical: unique(getAboveBelowNet(enneaTree, x, y))
  };
}

export function getButtonNeighbouringNets(enneaTree, x, y){
  return unique(getRightNet(enneaTree, x, y));
}

function unique(iteratorA, iteratorB=[]){
  return [...iteratorA, ...iteratorB]
    .filter(net => net != GROUND)
    .filter((net, index, nets) => nets.indexOf(net) === index);
}

function* getNetAroundWire(enneaTree, x, y){
  yield* getLeftRightNet(enneaTree, x, y);
  yield* getAboveBelowNet(enneaTree, x, y);
}

function* getLeftRightNet(enneaTree, x, y){
  yield getNetAt(enneaTree, x-1, y+0, -1, 0);
  yield getNetAt(enneaTree, x+1, y+0, +1, 0);
}

function* getAboveBelowNet(enneaTree, x, y){
  yield getNetAt(enneaTree, x+0, y-1, 0, -1);
  yield getNetAt(enneaTree, x+0, y+1, 0, +1);
}

function* getRightNet(enneaTree, x, y){
  yield getNetAt(enneaTree, x+1, y+0, +1, 0);
}