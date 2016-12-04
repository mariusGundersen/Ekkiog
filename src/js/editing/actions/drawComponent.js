import * as ennea from 'ennea-tree';
import {allocate} from 'buddy-tree';

import {
  COMPONENT,
  GROUND
} from '../constants.js';

import getNetAt from '../query/getNetAt.js';
import floodFill from '../flooding/floodFill.js';

export default function drawComponent(forest, x, y, source=makeXOR()){
  const [buddyTree, ...nets] = allocate(forest.buddyTree, source.gates.length);

  const gates = source.gates.map((gate, index) => ({...gate, net: nets[index]}));

  const inputs = source.inputs.map((input, index) => ({
    x: input.x,
    y: input.y,
    dx: input.dx,
    dy: input.dy,
    net: getNetAt(forest.enneaTree, ...posOf(x, y, input.x, input.y, input.dx, input.dy)),
    pointsTo: [...makePointsTo(gates, index)]
  }));

  const outputs = source.outputs.map(output => ({
    x: output.x,
    y: output.y,
    dx: output.dx,
    dy: output.dy,
    net: nets[output.gate]
  }));

  const data = {
    type: COMPONENT,
    nets,
    inputs,
    outputs,
    gates: source.gates.map((gate, index) => makeGate(gate, index, nets))
  };
  const box = {left:x, top:y, width:source.width, height:source.height};
  let enneaTree = ennea.set(forest.enneaTree, data, box);

  if(forest.enneaTree === enneaTree){
    return forest;
  }

  enneaTree = floodFill(enneaTree, ...outputs.map(output => ({
    left: box.left + output.x,
    top: box.top + output.y,
    dx: output.dx,
    dy: output.dy,
    type: COMPONENT,
    net: output.net
  })));

  return {
    enneaTree,
    buddyTree
  };
}

export function posOf(sx, sy, x, y, dx, dy){
  return [sx+x+dx, sy+y+dy, dx, dy];
}

export function* makePointsTo(gates, index){
  yield* gates
    .filter(g => g.inputA.type === 'input' && g.inputA.index === index)
    .map(g => ({net: g.net, input: 'A'}));
  yield* gates
    .filter(g => g.inputB.type === 'input' && g.inputB.index === index)
    .map(g => ({net: g.net, input: 'B'}));
}

export function makeGate(gate, index, nets){
  return {
    net: nets[index],
    inputA: gate.inputA.type === 'input'
      ? GROUND
      : nets[gate.inputA.index],
    inputB: gate.inputB.type === 'input'
      ? GROUND
      : nets[gate.inputB.index]
  };
}

function makeXOR(){
  return {
    width: 3,
    height: 5,
    inputs: [
      {
        x: 0,
        y: 1,
        dx: -1,
        dy: 0
      },
      {
        x: 0,
        y: 3,
        dx: -1,
        dy: 0
      }
    ],
    outputs: [
      {
        x: 2,
        y: 2,
        dx: 1,
        dy: 0,
        gate: 3
      }
    ],
    gates: [
      {
        inputA: {
          type: 'input',
          index: 0
        },
        inputB: {
          type: 'input',
          index: 1
        }
      },
      {
        inputA: {
          type: 'input',
          index: 0
        },
        inputB: {
          type: 'gate',
          index: 0
        }
      },
      {
        inputA: {
          type: 'gate',
          index: 0
        },
        inputB: {
          type: 'input',
          index: 1
        }
      },
      {
        inputA: {
          type: 'gate',
          index: 1
        },
        inputB: {
          type: 'gate',
          index: 2
        }
      }
    ]
  };
}