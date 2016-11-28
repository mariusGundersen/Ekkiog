import * as ennea from 'ennea-tree';

import {
  EMPTY
} from '../constants.js';

export default function getTypeAt(enneaTree, x, y){
  const tile = ennea.get(enneaTree, y, x);

  return tile && tile.data && tile.data.type || EMPTY;
}