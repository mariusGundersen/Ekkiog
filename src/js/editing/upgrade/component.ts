import {
  Component, ComponentPin
} from '../types';


export interface Component0 {
  type : 'component',
  schema? : undefined,
  inputs : ComponentInput0[],
  outputs : ComponentOutput0[],
  gates : ComponentGate1[],
  nets : number[],
  hash : string,
  repo : string,
  name? : string,
  version : string
}

export interface Component1 {
  type : 'component',
  schema : 1,
  inputs : ComponentInput0[],
  outputs : ComponentOutput0[],
  gates : ComponentGate1[],
  nets : number[],
  hash : string,
  repo : string,
  name : string,
  version : string
}

export interface ComponentInput0{
  readonly x : number,
  readonly y : number,
  readonly dx : number,
  readonly dy : number,
  readonly net : number,
  readonly pointsTo : ComponentInputPointer0[],
  readonly name? : string
}

export interface ComponentInputPointer0 {
  readonly input : 'A' | 'B',
  readonly index : number
}

export interface ComponentOutput0 {
  readonly x : number,
  readonly y : number,
  readonly net : number,
  readonly dx : number,
  readonly dy : number,
  readonly name? : string
}

export interface ComponentGate1 {
  net : number,
  inputA : number,
  inputB : number
}

export interface Component2 {
  readonly type : 'component',
  readonly schema : 2,
  readonly inputs : ComponentInput0[],
  readonly outputs : ComponentOutput0[],
  readonly gates : ComponentGate2[],
  readonly net : number,
  readonly hash : string,
  readonly repo : string,
  readonly name : string,
  readonly version : string
}

export type ComponentGate2 = Readonly<[number, number]>;


export default function upgradeComponent(component : Component | Component2 | Component1 | Component0, size : {width : number, height : number}) : Component {
  return from2to3(from1to2(from0to1(component)), size.width, size.height);
}

function from0to1(component: Component0 | Component1 | Component2 | Component) : Component1 | Component2 | Component {
  if(component.schema === undefined) {
    return {
      type: 'component',
      schema: 1,
      inputs: component.inputs,
      outputs: component.outputs,
      gates: component.gates,
      nets: component.nets,
      name: component.name || 'unknown',
      repo: '',
      version: '0',
      hash: '0000000000000000000000000000000000000000'
    } as Component1;
  }else{
    return component;
  }
}

function from1to2(component: Component1 | Component2 | Component) : Component | Component2 {
  if(component.schema === 1){
    return {
      type: 'component',
      schema: 2,
      inputs: component.inputs,
      outputs: component.outputs,
      gates: component.gates.map(({inputA, inputB}) => [inputA, inputB] as [number, number]),
      net: component.nets[0],
      name: component.name,
      repo: component.repo,
      version: component.version,
      hash: component.hash
    } as Component2;
  }else{
    return component;
  }
}

function from2to3(component: Component2 | Component, width : number, height : number) : Component {
  if(component.schema === 2){
    return {
      type: 'component',
      schema: 3,
      net: component.net,
      inputs: component.inputs.map(input => ({
        name: input.name,
        net: input.net,
        input: 0
      })),
      outputs: component.outputs.map(output => ({
        name: output.name,
        net: output.net
      })),
      package: {
        hash: component.hash,
        name: component.name,
        repo: component.repo,
        version: component.version,
        height,
        width,
        inputs: component.inputs.map((input, index) => ({
          x: input.x,
          y: input.y,
          dx: input.dx,
          dy: input.dy,
          group: index
        })),
        outputs: component.outputs.map(output => ({
          x: output.x,
          y: output.y,
          dx: output.dx,
          dy: output.dy,
          name: output.name || '',
          gate: output.net-component.net
        })),
        gates: component.gates.map(gate => [
          gate[0] < component.net ? 'GROUND' : gate[0] - component.net,
          gate[1] < component.net ? 'GROUND' : gate[1] - component.net
        ]),
        groups: component.inputs.map(input => ({
          name: input.name || '',
          pointsTo: input.pointsTo.map(point => ({
            gate: point.index,
            input: point.input
          }))

        }))
      }
    } as Component;
  }else{
    return component;
  }
}