import * as ennea from 'ennea-tree';

import {
  Forest,
  Gate,
  Component,
  Button,
  Light,
  Package,
  PackageGate,
  PackageOutput,
  PackageInput,
  PackageInputGroup
} from '../types';

import {
 GATE,
 COMPONENT,
 BUTTON,
 LIGHT,
 GROUND
} from '../constants';

import {
  directionToDx,
  directionToDy,
  flatten
} from '../utils';

import layoutPins, { Pin } from './layoutPins';

type GateAddress = {
  readonly net: number,
  readonly a: number,
  readonly b: number
};

export default function compile(forest : Forest, repo : string, name : string, version : string, hash : string) : Package {
  const enneaTree = forest.enneaTree;
  const forestContet = ennea.getAll(enneaTree, {
    top: 0,
    left: 0,
    width: enneaTree.size,
    height: enneaTree.size
  });

  const forestButtons = forestContet
    .filter((node) : node is ennea.AreaData<Button> => node.data.type === BUTTON);

  const forestGates = forestContet
    .filter((node) : node is ennea.AreaData<Gate> => node.data.type === GATE)
    .map(node => node.data);

  const forestComponents = forestContet
    .filter((node) : node is ennea.AreaData<Component> => node.data.type === COMPONENT)
    .map(node => node.data);

  const forestLights = forestContet
    .filter((node) : node is ennea.AreaData<Light> => node.data.type === LIGHT && node.data.net !== GROUND);

  return {
    ...createPackage(forestGates, forestComponents, forestButtons, forestLights),
    name,
    hash,
    repo,
    version
  };
}

function createPackage(
  forestGates: Gate[],
  forestComponents: Component[],
  forestButtons: ennea.AreaData<Button>[],
  forestLights: ennea.AreaData<Light>[]) {

  const gateAddresses = [
    ...forestGates.map(makeGate),
    ...forestComponents.map(makeGatesFromComponent).reduce(flatten, [])
  ];

  const netToGateIndex = new Map(gateAddresses.map((gate, index) => [gate.net, index] as [number, number]));
  const netToButtonIndex = new Map(forestButtons.map((button, index) => [button.data.net, index] as [number, number]));

  const layout = layoutPins(
    forestButtons.map(toPin).concat(forestLights.map(toPin).map(reverseDirection).filter(pin => netToButtonIndex.has(pin.net))),
    forestLights.map(toPin).filter(pin => netToGateIndex.has(pin.net))
  );

  const inputs: PackageInput[] = layout.inputs
    .map(pin => ({
      group: netToButtonIndex.get(pin.net) || 0,
      x: pin.x,
      y: pin.y,
      dx: -pin.dx,
      dy: -pin.dy
    }));

  const gates: PackageGate[] = gateAddresses
    .map(gate => [
      groundIfUndefined(netToGateIndex.get(gate.a)),
      groundIfUndefined(netToGateIndex.get(gate.b))
    ] as PackageGate);

  const outputs: PackageOutput[] = layout.outputs
    .map(pin => ({
      gate: netToGateIndex.get(pin.net),
      x: pin.x,
      y: pin.y,
      dx: pin.dx,
      dy: pin.dy,
      name: pin.name
    }))
    .filter((node) : node is PackageOutput => node.gate !== undefined);

  const groups: PackageInputGroup[] = forestButtons.map(button => ({
    name: button.data.name,
    pointsTo: [
      ...gateAddresses.filter(g => g.a === button.data.net).map(makeInput('A', netToGateIndex)),
      ...gateAddresses.filter(g => g.b === button.data.net).map(makeInput('B', netToGateIndex))
    ],
  }))

  return {
    width: layout.width,
    height: layout.height,
    inputs,
    outputs,
    gates,
    groups
  };
}

function makeGate({net, inputA: a, inputB: b} : Gate) : GateAddress {
  return {
    net,
    a,
    b
  };
}

function makeGatesFromComponent(component: Component) : GateAddress[] {
  const gates = component.package.gates;
  const inputs = component.inputs;
  const pins = component.package.groups
    .map((input, index) => input.pointsTo.map(({gate, input}) => ({gate, net: inputs[index].net, input})))
    .reduce(flatten, []);
  const pointsToA = new Map(pins.filter(p => p.input === 'A').map(p => [p.gate, p.net] as [number, number]));
  const pointsToB = new Map(pins.filter(p => p.input === 'B').map(p => [p.gate, p.net] as [number, number]));
  return gates.map(([a, b], index) => ({
    net: component.net + index,
    a: a !== 'GROUND' ? component.net + a : pointsToA.get(index) || GROUND,
    b: b !== 'GROUND' ? component.net + b : pointsToB.get(index) || GROUND
  }));
}

export function ensureNetExists(input : number | undefined) : number{
  if(input == undefined){
    throw new Error("could not find any net");
  }

  return input;
}

function makeInput(input : 'A' | 'B', netToIndexMap : Map<number, number>){
  return (gate : GateAddress) => ({
    input,
    gate: netToIndexMap.get(gate.net) || 0
  });
}

function toPin({ top: y, left: x, data: { direction, net, name } } : ennea.AreaData<Button | Light>) : Pin {
  return {
    x,
    y,
    dx: directionToDx(direction),
    dy: directionToDy(direction),
    net,
    name
  }
};

function reverseDirection(pin : Pin) : Pin {
  return {
    ...pin,
    dx: -pin.dx,
    dy: -pin.dy
  };
}

function groundIfUndefined(a : number | undefined) : number | 'GROUND' {
  return a === undefined ? 'GROUND' : a;
}