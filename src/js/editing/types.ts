import { Node } from 'ennea-tree';
import { Node as BuddyNode } from 'buddy-tree';

export interface Forest {
  buddyTree : BuddyNode,
  enneaTree : TreeNode
}

export type TreeNode = Node<Item>;

export interface Wire{
  type: 'wire',
  net: number
}

export interface Gate{
  type : 'gate',
  net : number,
  inputA : number,
  inputB : number
}

export interface Underpass{
  type : 'underpass',
  net : number
}

export interface Button{
  type : 'button',
  net : number,
  state : boolean
}

export interface Component{
  type : 'component',
  inputs : {x : number, y : number, net : number, pointsTo : ComponentInputPointer[]}[],
  outputs : {x : number, y : number, net : number, dx : number, dy : number}[],
  gates : {net : number, inputA : number, inputB : number}[],
  nets : number[]
}

export interface ComponentInputPointer {
  input : 'A' | 'B',
  net : number
}

export interface Input{
  type : 'input'
}

export interface Output{
  type : 'output'
}

export type Item = Wire
  | Gate
  | Underpass
  | Button
  | Component
  | Input
  | Output;


export interface Context{
  mapTexture : {
    get(x : number, y : number) : number,
    set(x : number, y : number, tile : number) : void
  },
  netMapTexture : {
    get(x : number, y : number) : number,
    set(x : number, y : number, net : number) : void
  },
  gatesTexture : {
    get(x : number, y : number) : number,
    set(x : number, y : number, net : number) : void
  }
}

export interface ComponentSource {
  width : number,
  height : number,
  gates : ComponentSourceGate[],
  inputs : {
    x : number,
    y : number,
    dx : number,
    dy : number
  }[]
  outputs : {
    x : number,
    y : number,
    dx : number,
    dy : number,
    gate : number
  }[]
}

export interface ComponentSourceGate {
  net : number,
  inputA : ComponentSourceGateInput,
  inputB : ComponentSourceGateInput
}

export interface ComponentSourceGateInput{
  type : 'gate' | 'input',
  index : number
}