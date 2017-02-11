import * as ennea from 'ennea-tree';

import {
  BUTTON
} from '../constants';

import { Forest, Button } from '../types';

export default function toggleButton(forest : Forest, x : number, y : number) : Forest{
  const buddyTree = forest.buddyTree;
  const updater = ennea.update(forest.enneaTree, old => (old.type === BUTTON ? {
    ...old,
    state: !old.state
  } : old));
  updater.update({top: y, left: x}, {});
  const enneaTree = updater.result();

  return {
    buddyTree,
    enneaTree
  };
}