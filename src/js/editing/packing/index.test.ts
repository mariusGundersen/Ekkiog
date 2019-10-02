import test from 'ava';

import {
  Package
} from '../types';


import createForest from '../actions/createForest';
import drawGate from '../actions/drawGate';
import drawWire from '../actions/drawWire';
import drawUnderpass from '../actions/drawUnderpass';
import drawButton from '../actions/drawButton';
import drawLight from '../actions/drawLight';
import drawComponent from '../actions/drawComponent';

import compile from './index';

export const andPackage : Package = {
  repo: 'repo',
  name: 'AND',
  version: 'version',
  hash: 'hash',
  width: 3,
  height: 5,
  inputs: [
    {
      dx: -1,
      dy: -0,
      x: 0,
      y: 1,
      group: 0
    },
    {
      dx: -1,
      dy: -0,
      x: 0,
      y: 3,
      group: 1
    }
  ],
  outputs: [
    {
      dx: 1,
      dy: 0,
      x: 2,
      y: 2,
      gate: 1,
      name: ''
    }
  ],
  gates: [
    ['GROUND', 'GROUND'],
    [0, 0]
  ],
  groups: [
    {
      pointsTo: [
        {
          gate: 0,
          input: 'A'
        }
      ],
      name: ''
    },
    {
      pointsTo: [
        {
          gate: 0,
          input: 'B'
        }
      ],
      name: ''
    }
  ]
};

export const straightThroughPackage : Package = {
  repo: 'repo',
  name: 'name',
  version: 'version',
  hash: 'hash',
  width: 3,
  height: 3,
  inputs: [
    { x: 0, y: 1, dx: -1, dy: -0, group: 0 },
    { x: 2, y: 1, dx: 1, dy: 0, group: 0 }
  ],
  outputs: [],
  gates: [],
  groups: [
    { pointsTo: [], name: '' }
  ]
};

test('compile single gate', t => {
  const forest = drawGate(createForest(), 64, 64);
  const compiled = compile(forest, 'repo', 'name', 'version', 'hash');
  t.deepEqual(compiled, {
    repo: 'repo',
    name: 'name',
    version: 'version',
    hash: 'hash',
    width: 3,
    height: 3,
    inputs: [],
    outputs: [],
    gates: [
      ['GROUND', 'GROUND']
    ],
    groups: []
  });
});

test('compile lightbulb with ground net', t => {
  const forest = drawLight(createForest(), 64, 64);
  const compiled = compile(forest, 'repo', 'name', 'version', 'hash');
  t.deepEqual(compiled, {
    repo: 'repo',
    name: 'name',
    version: 'version',
    hash: 'hash',
    width: 3,
    height: 3,
    inputs: [],
    outputs: [],
    gates: [],
    groups: []
  });
});

test('compile lightbulb connected to button', t => {
  let forest = createForest();
  forest = drawLight(forest, 64, 64);
  forest = drawButton(forest, 61, 64);
  const compiled = compile(forest, 'repo', 'name', 'version', 'hash');
  t.deepEqual(compiled, straightThroughPackage);
});

test('compile two gates', t => {
  let forest = createForest();
  forest = drawGate(forest, 64, 64);
  forest = drawGate(forest, 60, 65);
  const compiled = compile(forest, 'repo', 'name', 'version', 'hash');
  t.deepEqual(compiled.gates, [
    ['GROUND', 'GROUND'],
    ['GROUND', 0]
  ]);
});

test('compile three gates', t => {
  let forest = createForest();
  forest = drawGate(forest, 64, 64);
  forest = drawGate(forest, 59, 62);
  forest = drawGate(forest, 59, 66);
  forest = drawWire(forest, 60, 62);
  forest = drawWire(forest, 60, 63);
  forest = drawWire(forest, 60, 65);
  forest = drawWire(forest, 60, 66);
  const compiled = compile(forest, 'repo', 'name', 'version', 'hash');
  t.deepEqual(compiled.gates, [
    ['GROUND', 'GROUND'],
    ['GROUND', 'GROUND'],
    [0, 1]
  ]);
});


test('compile NOT gate', t => {
  let forest = createForest();
  forest = drawButton(forest, 58, 64);
  forest = drawGate(forest, 64, 64);
  forest = drawWire(forest, 60, 63);
  forest = drawWire(forest, 60, 64);
  forest = drawWire(forest, 60, 65);
  forest = drawLight(forest, 66, 64);
  const compiled = compile(forest, 'repo', 'NOT', 'version', 'hash');
  t.deepEqual(compiled, {
    repo: 'repo',
    name: 'NOT',
    version: 'version',
    hash: 'hash',
    width: 3,
    height: 3,
    inputs: [
      {
        dx: -1,
        dy: -0,
        x: 0,
        y: 1,
        group: 0
      }
    ],
    outputs: [
      {
        dx: 1,
        dy: 0,
        x: 2,
        y: 1,
        gate: 0,
        name: ''
      }
    ],
    gates: [
      ['GROUND', 'GROUND']
    ],
    groups: [
      {
        pointsTo: [
          {
            gate: 0,
            input: 'A'
          },
          {
            gate: 0,
            input: 'B'
          }
        ],
        name: ''
      }
    ]
  });
});

test('compile AND gate', t => {
  const forest = andForest();
  const compiled = compile(forest, 'repo', 'AND', 'version', 'hash');
  t.deepEqual(compiled, andPackage);
});

test('compile XOR gate', t => {
  const forest = xorForest();
  const compiled = compile(forest, 'repo', 'XOR', 'version', 'hash');
  t.deepEqual(compiled, {
    repo: 'repo',
    name: 'XOR',
    version: 'version',
    hash: 'hash',
    width: 3,
    height: 5,
    inputs: [
      {
        dx: -1,
        dy: -0,
        x: 0,
        y: 1,
        group: 0
      },
      {
        dx: -1,
        dy: -0,
        x: 0,
        y: 3,
        group: 1
      }
    ],
    outputs: [
      {
        dx: 1,
        dy: 0,
        x: 2,
        y: 2,
        gate: 3,
        name: ''
      }
    ],
    gates: [
      ['GROUND', 2],
      [2, 'GROUND'],
      ['GROUND', 'GROUND'],
      [0, 1]
    ],
    groups: [
      {
        pointsTo: [
          {
            gate: 0,
            input: 'A'
          },
          {
            gate: 2,
            input: 'A'
          }
        ],
        name: ''
      },
      {
        pointsTo: [
          {
            gate: 1,
            input: 'B'
          },
          {
            gate: 2,
            input: 'B'
          }
        ],
        name: ''
      }
    ]
  });
});

test('half adder', t => {
  const andComponent = compile(andForest(), 'repo', 'AND', 'version', 'hash');
  const xorComponent = compile(xorForest(), 'repo', 'XOR', 'version', 'hash');
  let forest = createForest();
  forest = drawButton(forest, 58, 60);
  forest = drawWire(forest, 60, 60);
  forest = drawWire(forest, 61, 60);
  forest = drawWire(forest, 62, 60);//and inputA
  forest = drawWire(forest, 62, 61);
  forest = drawUnderpass(forest, 62, 62);
  forest = drawWire(forest, 62, 63);
  forest = drawWire(forest, 62, 64);
  forest = drawWire(forest, 62, 65);//xor inputA

  forest = drawButton(forest, 58, 63);
  forest = drawWire(forest, 60, 62);
  forest = drawWire(forest, 61, 62);
  //forest = drawWire(forest, 62, 62);//and inputB
  forest = drawWire(forest, 60, 63);
  forest = drawWire(forest, 60, 64);
  forest = drawWire(forest, 60, 65);
  forest = drawWire(forest, 60, 66);
  forest = drawWire(forest, 60, 67);
  forest = drawWire(forest, 61, 67);
  forest = drawWire(forest, 62, 67);//xor inputB

  forest = drawComponent(forest, 64, 61, andComponent);
  forest = drawComponent(forest, 64, 66, xorComponent);
  forest = drawLight(forest, 67, 61);
  forest = drawLight(forest, 67, 66);
  const compiled = compile(forest, 'repo', 'HALF-ADDER', 'version', 'hash');
  t.deepEqual(compiled, {
    repo: 'repo',
    name: 'HALF-ADDER',
    version: 'version',
    hash: 'hash',
    width: 3,
    height: 5,
    inputs: [
      { x: 0, y: 1, dx: -1, dy: -0, group: 0 },
      { x: 0, y: 3, dx: -1, dy: -0, group: 1 }
    ],
    outputs: [
      { gate: 1, x: 2, y: 1, dx: 1, dy: 0, name: '' },
      { gate: 5, x: 2, y: 3, dx: 1, dy: 0, name: '' }
    ],
    gates: [
      ['GROUND', 'GROUND'],
      [0, 0],
      ['GROUND', 4],
      [4, 'GROUND'],
      ['GROUND', 'GROUND'],
      [2, 3]
    ],
    groups: [
      { name: '', pointsTo: [
        { gate: 0, input: 'A'},
        { gate: 2, input: 'A'},
        { gate: 4, input: 'A'}
      ]},
      { name: '', pointsTo: [
        { gate: 0, input: 'B'},
        { gate: 3, input: 'B'},
        { gate: 4, input: 'B'}
      ]}
    ]
  });
});


test('XOR inside XOR', t => {
  let forest = xorForest();
  const xorComponent = compile(forest, 'repo', 'XOR', 'version', 'hash');
  forest = drawButton(forest, 58, 40);
  forest = drawWire(forest, 60, 40);
  forest = drawWire(forest, 60, 41);

  forest = drawButton(forest, 58, 44);
  forest = drawWire(forest, 60, 44);
  forest = drawWire(forest, 60, 43);

  forest = drawComponent(forest, 64, 42, xorComponent);
  forest = drawLight(forest, 67, 42);

  const compiled = compile(forest, 'repo', 'XOR', 'version', 'hash');

  t.is(compiled.gates.length, 8);
  t.is(compiled.inputs.length, 4);
  t.is(compiled.outputs.length, 2);
});



test('tripple XOR', t => {
  const xorComponent = compile(xorForest(), 'repo', 'XOR', 'version', 'hash');
  let forest = createForest();

  forest = drawComponent(forest, 66, 64, xorComponent);
  forest = drawComponent(forest, 62, 62, xorComponent);

  forest = drawButton(forest, 58, 60);
  forest = drawWire(forest, 60, 60);
  forest = drawWire(forest, 60, 61);

  forest = drawButton(forest, 58, 64);
  forest = drawWire(forest, 60, 64);
  forest = drawWire(forest, 60, 63);
  forest = drawWire(forest, 64, 62);
  forest = drawWire(forest, 64, 63);

  forest = drawButton(forest, 62, 66);
  forest = drawWire(forest, 64, 66);
  forest = drawWire(forest, 64, 65);


  forest = drawLight(forest, 69, 64);

  const compiled = compile(forest, 'repo', 'XOR', 'version', 'hash');

  t.deepEqual(compiled.groups.map(group => group.pointsTo), [
    [
      { gate: 0, input: 'A' },
      { gate: 2, input: 'A' }
    ],
    [
      { gate: 5, input: 'B' },
      { gate: 6, input: 'B' }
    ],
    [
      { gate: 1, input: 'B' },
      { gate: 2, input: 'B' }
    ]
  ]);

  t.deepEqual(compiled.gates, [
    ['GROUND', 2],
    [2, 'GROUND'],
    ['GROUND', 'GROUND'],
    [0, 1],
    [3, 6],
    [6, 'GROUND'],
    [3, 'GROUND'],
    [4, 5]
  ]);
});


function andForest(forest = createForest()){
  forest = drawButton(forest, 58, 62);
  forest = drawWire(forest, 60, 62);
  forest = drawWire(forest, 60, 63);

  forest = drawButton(forest, 58, 66);
  forest = drawWire(forest, 60, 66);
  forest = drawWire(forest, 60, 65);

  forest = drawGate(forest, 64, 64);

  forest = drawWire(forest, 65, 63);
  forest = drawWire(forest, 65, 64);
  forest = drawWire(forest, 65, 65);

  forest = drawGate(forest, 69, 64);

  forest = drawLight(forest, 71, 64);
  return forest;
}

function xorForest(forest = createForest()){
  forest = drawButton(forest, 58, 62);
  forest = drawButton(forest, 58, 66);
  forest = drawWire(forest, 60, 63);
  forest = drawWire(forest, 60, 62);
  forest = drawWire(forest, 60, 61);
  forest = drawWire(forest, 61, 61);
  forest = drawWire(forest, 62, 61);
  forest = drawWire(forest, 63, 61);
  forest = drawWire(forest, 64, 61);
  forest = drawWire(forest, 65, 61);

  forest = drawWire(forest, 60, 65);
  forest = drawWire(forest, 60, 66);
  forest = drawWire(forest, 60, 67);
  forest = drawWire(forest, 61, 67);
  forest = drawWire(forest, 62, 67);
  forest = drawWire(forest, 63, 67);
  forest = drawWire(forest, 64, 67);
  forest = drawWire(forest, 65, 67);

  forest = drawGate(forest, 64, 64);
  forest = drawWire(forest, 65, 63);
  forest = drawWire(forest, 65, 64);
  forest = drawWire(forest, 65, 65);

  forest = drawGate(forest, 69, 62);
  forest = drawGate(forest, 69, 66);

  forest = drawWire(forest, 70, 62);
  forest = drawWire(forest ,70, 63);

  forest = drawWire(forest, 70, 65);
  forest = drawWire(forest ,70, 66);

  forest = drawGate(forest, 74, 64);
  forest = drawLight(forest, 76, 64);

  return forest;
}