import {
  Direction
} from './types';

import {
  LEFTWARDS,
  RIGHTWARDS,
  UPWARDS,
  DOWNWARDS
} from './constants';

export function directionToDx(direction : Direction){
  switch(direction){
    case LEFTWARDS:
      return -1;
    case RIGHTWARDS:
      return 1;
    case DOWNWARDS:
    case UPWARDS:
    default:
      return 0;
  }
}

export function directionToDy(direction : Direction){
  switch(direction){
    case DOWNWARDS:
      return 1;
    case UPWARDS:
      return -1;
    case LEFTWARDS:
    case RIGHTWARDS:
    default:
      return 0;
  }
}

export function* zip<TA, TB>(a : TA[], b : TB[]){
  for(let i=0; i<a.length; i++){
    yield [a[i], b[i], i] as [TA, TB, number];
  }
}

export function flatten<T>(a : T[] = [], b : T[]){
  return a.concat(b);
}

export function distinct<T>(e : T, i : number, c : T[]){
  return c.indexOf(e) === i;
}