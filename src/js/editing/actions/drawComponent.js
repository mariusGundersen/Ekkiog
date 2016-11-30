import * as ennea from 'ennea-tree';
import {allocate} from 'buddy-tree';

import {
  COMPONENT,
  GROUND
} from '../constants.js';

import getNetAt from '../query/getNetAt.js';
import {getGateNeighbouringNets} from '../query/getNeighbouringNets.js';
import floodFill from '../flooding/floodFill.js';

export default function drawComponent(forest, x, y, source=makeXOR()){
  const neighbouringNets = getGateNeighbouringNets(forest.enneaTree, x, y);

  if(neighbouringNets.length === 1){
    return forest;
  }

  const [buddyTree, ...nets] = allocate(forest.buddyTree, source.gates.length);

  const inputs = source.inputs.map(input => ({
    x: input.x,
    y: input.y,
    net: getNetAt(forest.enneaTree, ...posOf(x, y, input.x, input.y, source.width, source.height));
  }));

  const outputs = source.outputs.map(output => ({
    x: output.x,
    y: output.y,
    net: nets[output.gate]
  }));

  const data = {
    type: COMPONENT,
    inputs,
    outputs,
    gates: source.gates
  };
  const box = {left:x, top:y, width:source.width, height:source.height};
  let enneaTree = ennea.set(forest.enneaTree, data, box);

  if(forest.enneaTree === enneaTree){
    return forest;
  }

  for(const output of outputs){
    enneaTree = floodFill(enneaTree, output.net, {...box, data});
  }

  return {
    enneaTree,
    buddyTree
  };
}

export function posOf(sx, sy, x, y, w, h){
  if(x === 0){
    return [sx+x-1, sy+y, -1, 0];
  }else if(y === 0){
    return [sx+x, sy+y-1, 0, -1];
  }else if(x === w-1){
    return [sx+x+1, sy+y, 1, 0];
  }else if(y === h-1){
    return [sx+x, sy+y+1, 0, 1];
  }else{
    return [sx+x, sy+y, 0, 0];
  }
}

function makeXOR(){
  return {
    width: 3,
    height: 5,
    inputs: [
      {
        x: 0,
        y: 1
      },
      {
        x: 0,
        y: 3
      }
    ],
    outputs: [
      {
        x: 2,
        y: 2,
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