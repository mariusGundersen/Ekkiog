import * as ennea from 'ennea-tree';
import { deallocate } from 'buddy-tree';

import {
  GATE,
  BUTTON,
  COMPONENT,
  LIGHT
} from '../constants';

import { floodFillGround } from '../flooding/floodFill';

import { Forest, Item } from '../types';

export default function clear(forest: Forest, x: number, y: number, width = 1, height = 1): Forest {
  let { tree: enneaTree, cleared } = ennea.clear(forest.enneaTree, { left: x, top: y, width, height }, canClearItem);

  if (cleared.length === 0)
    return forest;

  enneaTree = floodFillGround(enneaTree, cleared.map(c => [c.data, c]));

  const buddyTree = cleared.map(getNetSource)
    .filter(net => net > 1)
    .reduce(deallocate, forest.buddyTree);

  return {
    enneaTree,
    buddyTree,
    testScenario: forest.testScenario
  };
}

function getNetSource(box: ennea.AreaData<Item>) {
  if (box.data == null) {
    return -1;
  }

  switch (box.data.type) {
    case GATE:
    case BUTTON:
    case COMPONENT:
      return box.data.net
    default:
      return -1;
  }
}

function canClearItem(item: Item): boolean {
  switch (item.type) {
    case BUTTON:
    case LIGHT:
      return item.permanent !== true;
    default:
      return true;
  }
}
