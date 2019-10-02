import {
  ChangeSet,
  Area
} from 'ennea-tree';

import {
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,
  COMPONENT,
  LIGHT
} from '../constants';

import {
  Item,
  Wire,
  Gate,
  Underpass,
  Button,
  Component,
  Light,
  MutableContext
} from '../types';

import {
  directionToDx,
  directionToDy,
  zip
} from '../utils';

import * as tile from './tile';

export default function set(context: MutableContext, change: ChangeSet<Item>) {
  switch (change.after.type) {
    case WIRE:
      return wire(context, change, change.after);
    case GATE:
      return gate(context, change, change.after);
    case UNDERPASS:
      return underpass(context, change, change.after);
    case BUTTON:
      return button(context, change, change.after);
    case COMPONENT:
      return component(context, change, change.after);
    case LIGHT:
      return light(context, change, change.after);
  }
}

export function wire(context: MutableContext, { top: y, left: x }: Area, wire: Wire) {
  context.setMap(x, y, tile.wire());
  context.setNet(x, y, wire.net);
}

export function gate(context: MutableContext, { top: y, left: x, width, height }: Area, gate: Gate) {
  for (let ty = 0; ty < height; ty++) {
    for (let tx = 0; tx < width; tx++) {
      context.setMap(tx + x, ty + y, tile.gate(tx, ty));
    }
  }
  context.setNet(x + 3, y + 1, gate.net);
  context.setNet(x + 0, y + 0, gate.inputA);
  context.setNet(x + 0, y + 2, gate.inputB);
  context.setGate(gate.net, gate.inputA, gate.inputB);
}

export function underpass(context: MutableContext, { top: y, left: x }: Area, underpass: Underpass) {
  context.setMap(x, y, tile.underpass());
  context.setNet(x, y, underpass.net);
}

export function button(context: MutableContext, { top: y, left: x, width, height }: Area, button: Button) {
  const dx = directionToDx(button.direction);
  const dy = directionToDy(button.direction);
  for (let ty = 0; ty < height; ty++) {
    for (let tx = 0; tx < width; tx++) {
      if (tx - 1 === dx && ty - 1 === dy) {
        context.setMap(tx + x, ty + y, tile.buttonOutput(dx, dy));
      } else {
        context.setMap(tx + x, ty + y, tile.button(tx, ty));
      }
      context.setNet(tx + x, ty + y, button.net);
    }
  }
  context.setGate(button.net, 1, 1);
}

export function component(context: MutableContext, { top: y, left: x, width, height }: Area, component: Component) {
  const pins = [...component.package.inputs, ...component.package.outputs];

  for (let ty = 0; ty < height; ty++) {
    for (let tx = 0; tx < width; tx++) {
      context.setMap(tx + x, ty + y, tile.component(tx, ty, width - 1, height - 1, pins));
    }
  }

  for (const [pin, port] of zip(component.package.outputs, component.outputs)) {
    context.setNet(x + pin.x, y + pin.y, port.net);
  }

  for (const pin of component.package.inputs) {
    const port = component.inputs[pin.group];
    context.setNet(x + pin.x, y + pin.y, port.net);
  }

  for (const { a, b, index } of component.package.gates.map(([a, b], index) => ({ a, b, index }))) {
    context.setGate(
      component.net + index,
      component.net + (a === 'GROUND' ? 0 : a),
      component.net + (b === 'GROUND' ? 0 : b));
  }

  for (const [group, port] of zip(component.package.groups, component.inputs)) {
    for (const point of group.pointsTo) {
      if (point.input === 'A') {
        context.setGateA(component.net + point.gate, port.net);
      } else {
        context.setGateB(component.net + point.gate, port.net);
      }
    }
  }

  context.insertText(component, { top: y, left: x, width, height });
}

export function light(context: MutableContext, { top: y, left: x, width, height }: Area, light: Light) {
  const dx = directionToDx(light.direction);
  const dy = directionToDy(light.direction);
  for (let ty = 0; ty < height; ty++) {
    for (let tx = 0; tx < width; tx++) {
      if (dy === 0 && tx - 1 === -dx && ty === 1) {
        context.setMap(tx + x, ty + y, tile.lightInput(dx, dy));
      } else if (dx === 0 && tx === 1 && ty - 1 === -dy) {
        context.setMap(tx + x, ty + y, tile.lightInput(dx, dy));
      } else {
        context.setMap(tx + x, ty + y, tile.light(tx, ty));
      }
      context.setNet(tx + x, ty + y, light.net);
    }
  }
}
