import * as ennea from 'ennea-tree';

import {
 GATE
} from './constants';

export default function compile(forest){
  return {
    width: 3,
    height: 3,
    inputs: [

    ],
    outputs: [

    ],
    gates: ennea.getAll(forest.enneaTree, {top: 0, left: 0, width: forest.enneaTree.size, height: forest.enneaTree.size})
      .filter(node => node.data.type === GATE)
      .map(node => ({
        inputA: {
          type: node.data.inputA == 0 ? 'ground' : GATE
        },
        inputB: {
          type: node.data.inputB == 0 ? 'ground' : GATE
        }
      }))
  }
}