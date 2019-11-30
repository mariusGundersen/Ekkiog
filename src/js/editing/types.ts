import { Node, Area, Box, BoxArea } from 'ennea-tree';
import { Node as BuddyTree } from 'buddy-tree';

export type Direction = 'rightwards' | 'downwards' | 'leftwards' | 'upwards';

export type Tool = 'wire' | 'gate' | 'underpass' | 'button' | 'light' | 'component';

export type TileType = Tool | 'empty';

export interface Probe {
  readonly type: 'button' | 'light'
  readonly x: number
  readonly y: number
  readonly values: string
}

export interface TestScenario {
  readonly probes: Probe[]
}

export interface Forest {
  readonly buddyTree: BuddyTree
  readonly enneaTree: EnneaTree
  readonly testScenario?: TestScenario
}

export type EnneaTree = Node<Item>;

export { Area, Box, BoxArea, BuddyTree };

export interface Wire {
  readonly type: 'wire',
  readonly net: number
}

export interface Gate {
  readonly type: 'gate',
  readonly net: number,
  readonly inputA: number,
  readonly inputB: number
}

export interface Underpass {
  readonly type: 'underpass',
  readonly net: number
}

export interface Button {
  readonly type: 'button',
  readonly net: number,
  readonly name: string,
  readonly direction: Direction,
  readonly permanent?: boolean
}

export interface Component {
  readonly type: 'component',
  readonly schema: 3,
  readonly inputs: ComponentInputPin[],
  readonly outputs: ComponentPin[],
  readonly net: number,
  readonly package: Package
}

export interface ComponentInputPin extends ComponentPin {
  readonly input: number | -1
}

export interface ComponentPin {
  readonly net: number,
  readonly name?: string
}

export interface Light {
  readonly type: 'light',
  readonly net: number,
  readonly name: string,
  readonly direction: Direction,
  readonly permanent?: boolean
}

export type Item = Wire
  | Gate
  | Underpass
  | Button
  | Component
  | Light;

export interface MutableContext {
  setMap(x: number, y: number, tile: number): void;
  setNet(x: number, y: number, net: number): void;
  setGate(gate: number, inputA: number, inputB: number): void;
  setGateA(gate: number, inputA: number): void;
  setGateB(gate: number, inputB: number): void;
  clearGate(gate: number): void;
  insertText(item: Item, area: Area): void;
  removeText(item: Item): void;
  updateText(before: Item, after: Item): void;
}

export interface IHaveDirection {
  readonly dx: number,
  readonly dy: number
}

export interface IHavePosition {
  readonly x: number,
  readonly y: number
}

export interface Package {
  readonly width: number,
  readonly height: number,
  readonly gates: PackageGate[],
  readonly inputs: PackageInput[],
  readonly outputs: PackageOutput[],
  readonly groups: PackageInputGroup[],
  readonly repo: string,
  readonly name: string,
  readonly hash: string,
  readonly version: string
}

export interface PackageInputGroup {
  readonly name: string
  readonly pointsTo: PackageGatePointer[]
}

export interface PackageInput extends IHaveDirection, IHavePosition {
  readonly group: number
}

export interface PackageOutput extends IHaveDirection, IHavePosition {
  readonly name: string
  readonly gate: number
}

export type PackageGate = [number | 'GROUND', number | 'GROUND'];

export interface PackageGatePointer {
  readonly input: 'A' | 'B',
  readonly gate: number
}


declare global {
  interface Array<T> {
    filter<U extends T>(pred: (e: T, i: number, c: T[]) => e is U): U[];
  }
}
