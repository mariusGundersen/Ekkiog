import * as ennea from 'ennea-tree';

import * as tile from './tileType.js';

export default function* getSearchDirections(tree, x, y, type){
  if(type == WIRE){
    yield* getWireSearchDirections(tree, x, y);
  }else if(type == UNDERPASS){
    yield* getUnderpassSearchDirections(tree, x, y);
  }else if(type == GATE){
    yield* getGateSearchDirections(tree, x, y);
  }else if(type == BUTTON){
    yield* getButtonSearchDirections(tree, x, y);
  }
}

export function* getWireSearchDirections(tree, x, y){
  yield* searchLeft(tree, x, y);
  yield* searchRight(tree, x, y);

  yield* searchUp(tree, x, y);
  yield* searchDown(tree, x, y);
}

export function* getUnderpassSearchDirections(tree, x, y){
  yield* searchLeft(tree, x, y);
  yield* searchRight(tree, x, y);
}

export function* getGateSearchDirections(tree, x, y){
  yield* searchRight(tree, x, y);
}

export function* getButtonSearchDirections(tree, x, y){
  yield* searchRight(tree, x, y);
}

export function* searchLeft(tree, x, y){
  const left = ennea.get(tree, y, x-1);
  if(tile.isWire(left) || tile.isUnderpass(left) || tile.isGateOutput(left) || tile.isButtonOutput(left)){
    yield [x-1, y];
  }
}

export function* searchRight(tree, x, y){
  const right = ennea.get(tree, y, x+1);
  if(tile.isWire(right) || tile.isUnderpass(right) || tile.isGateInput(right)){
    yield [x+1, y];
  }
}

export function* searchUp(tree, x, y){
  let top = y-1;
  let above = ennea.get(tree, top, x);
  while(tile.isUnderpass(above)){
    top--;
    above = ennea.get(tree, top, x);
  }

  if(tile.isWire(above)){
    yield [x, top];
  }
}

export function* searchDown(tree, x, y){
  let top = y+1;
  let below = ennea.get(tree, top, x);
  while(tile.isUnderpass(below)){
    top++;
    below = ennea.get(tree, top, x);
  }

  if(tile.isWire(below)){
    yield [x, top];
  }
}