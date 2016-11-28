import * as ennea from 'ennea-tree';

import {
  BUTTON
} from '../constants.js';

export default function toggleButton(forest, x, y){
  const buddyTree = forest.buddyTree;
  const updater = ennea.update(forest.enneaTree, old => (old.type === BUTTON ? {
    ...old,
    state: !old.state
  } : old));
  updater.update({top: y, left: x});
  const enneaTree = updater.result();

  return {
    buddyTree,
    enneaTree
  };
}