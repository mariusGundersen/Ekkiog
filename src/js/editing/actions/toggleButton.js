import * as ennea from 'ennea-tree';

import {
  BUTTON
} from '../constants.js';

export default function toggleButton(context, x, y){
  const buddyTree = context.buddyTree;
  const updater = ennea.update(context.enneaTree, old => (old.type === BUTTON ? {
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