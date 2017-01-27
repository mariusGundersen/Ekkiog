import * as ennea from 'ennea-tree';

export default function isEmpty(enneaTree, top, left, right, bottom){
  return ennea.isEmpty(enneaTree, {top, left, right, bottom});
}