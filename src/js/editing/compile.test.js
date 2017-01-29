import test from 'ava';
import createForest from './actions/createForest.js';
import drawGate from './actions/drawGate.js';

import compile from './compile.js';

test('compile single gate', t => {
  const forest = drawGate(createForest(), 64, 64);
  const compiled = compile(forest);
  t.deepEqual(compiled, {
    width: 3,
    height: 3,
    inputs: [],
    outputs: [],
    gates: [
      {
        inputA: {
          type: 'ground'
        },
        inputB: {
          type: 'ground'
        }
      }
    ]
  });
});
