import { isEmpty as isItEmpty, Node } from 'ennea-tree';

import { EnneaTree } from '../types';

export default function isEmpty(enneaTree : EnneaTree, top : number, left : number, right : number, bottom : number){
  return isItEmpty(enneaTree, {top, left, right, bottom});
}