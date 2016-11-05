import getNetAt from '../query/getNetAt.js';

const GROUND = 0;

export function getWireNeighbouringNets(enneaTree, x, y){
  return unique(getNetAroundWire(enneaTree, x, y));
}

export function getUnderpassNeighbouringNets(enneaTree, x, y){
  return unique(getNetAroundUnderpass(enneaTree, x, y));
}

function unique(iterator){
  return [...iterator]
    .filter(net => net != GROUND)
    .filter((net, index, nets) => nets.indexOf(net) === index);
}

function* getNetAroundWire(enneaTree, x, y){
  yield getNetAt(enneaTree, x-1, y+0, -1, 0);
  yield getNetAt(enneaTree, x+1, y+0, +1, 0);
  yield getNetAt(enneaTree, x+0, y-1, 0, -1);
  yield getNetAt(enneaTree, x+0, y+1, 0, +1);
}

function* getNetAroundUnderpass(enneaTree, x, y){
  yield getNetAt(enneaTree, x-1, y+0, -1, 0);
  yield getNetAt(enneaTree, x+1, y+0, +1, 0);
}