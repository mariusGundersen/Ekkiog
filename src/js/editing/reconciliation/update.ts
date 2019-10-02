import { ChangeUpdate, Area, SET, CLEAR } from 'ennea-tree';

import set from './set';
import clear from './clear';

import {
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,
  COMPONENT,
  LIGHT,
  GROUND
} from '../constants';

import {
  Item,
  Wire,
  Gate,
  Underpass,
  Button,
  Light,
  Component,
  MutableContext
} from '../types';

import {
  directionToDx,
  directionToDy,
  zip
} from '../utils';

import * as tile from './tile';

export default function update(context: MutableContext, change: ChangeUpdate<Item>) {
  switch (change.after.type) {
    case WIRE:
      return updateWire(context, change, change.after);
    case GATE:
      return updateGate(context, change, change.before as Gate, change.after);
    case UNDERPASS:
      return updateUnderpass(context, change, change.after);
    case BUTTON:
      return updateButton(context, change, change.before as Button, change.after);
    case LIGHT:
      return updateLight(context, change, change.before as Light, change.after);
    case COMPONENT:
      if ((change.before as Component).package.hash === change.after.package.hash) {
        return updateComponent(context, change, change.before as Component, change.after);
      } else {
        const { top, left, width, height } = change;
        clear(context, { before: change.before, top, left, width, height, type: CLEAR });
        set(context, { after: change.after, top, left, width, height, type: SET });
      }
  }
}

export function updateWire(context: MutableContext, { top: y, left: x }: Area, wire: Wire) {
  context.setMap(x, y, tile.wire());
  context.setNet(x, y, wire.net);
}

export function updateGate(context: MutableContext, { top: y, left: x }: Area, oldGate: Gate, newGate: Gate) {
  var changed = false;

  if (oldGate.net !== newGate.net) {
    context.setNet(x + 3, y + 1, newGate.net);
    changed = true;
  }

  if (oldGate.inputA !== newGate.inputA) {
    context.setNet(x, y + 0, newGate.inputA);
    changed = true;
  }

  if (oldGate.inputB !== newGate.inputB) {
    context.setNet(x, y + 2, newGate.inputB);
    changed = true;
  }

  if (changed) {
    context.setGate(newGate.net, newGate.inputA, newGate.inputB);
  }
}

export function updateUnderpass(context: MutableContext, { top: y, left: x }: Area, underpass: Underpass) {
  context.setMap(x, y, tile.underpass());
  context.setNet(x, y, underpass.net);
}

export function updateButton(context: MutableContext, { top: y, left: x, width, height }: Area, oldButton: Button, newButton: Button) {
  if (oldButton.direction !== newButton.direction) {
    const oldDx = directionToDx(oldButton.direction);
    const oldDy = directionToDy(oldButton.direction);
    const newDx = directionToDx(newButton.direction);
    const newDy = directionToDy(newButton.direction);

    context.setMap(x + oldDx + 1, y + oldDy + 1, tile.button(oldDx + 1, oldDy + 1));
    context.setMap(x + newDx + 1, y + newDy + 1, tile.buttonOutput(newDx, newDy));
  }

  if (oldButton.net !== newButton.net) {
    for (let ty = 0; ty < height; ty++) {
      for (let tx = 0; tx < width; tx++) {
        context.setNet(tx + x, ty + y, newButton.net);
      }
    }
  }

  context.setGate(newButton.net, 1, 1);
}

export function updateLight(context: MutableContext, { top: y, left: x, width, height }: Area, oldLight: Light, newLight: Light) {
  if (oldLight.direction !== newLight.direction) {
    const oldDx = directionToDx(oldLight.direction);
    const oldDy = directionToDy(oldLight.direction);
    const newDx = directionToDx(newLight.direction);
    const newDy = directionToDy(newLight.direction);

    context.setMap(x - oldDx + 1, y - oldDy + 1, tile.light(-oldDx + 1, -oldDy + 1));
    context.setMap(x - newDx + 1, y - newDy + 1, tile.lightInput(newDx, newDy));
  }

  if (oldLight.net !== newLight.net) {
    for (let ty = 0; ty < height; ty++) {
      for (let tx = 0; tx < width; tx++) {
        context.setNet(tx + x, ty + y, newLight.net);
      }
    }
  }
}

export function updateComponent(context: MutableContext, { top: y, left: x }: Area, oldComponent: Component, newComponent: Component) {
  const oldInputs = oldComponent.inputs;
  const newInputs = newComponent.inputs;

  for (const [oldInput, newInput, index] of zip(oldInputs, newInputs)) {
    if (oldInput.net !== newInput.net) {
      for (const pin of oldComponent.package.inputs.filter(input => input.group === index)) {
        context.setNet(x + pin.x, y + pin.y, newInput.net);
      }
      for (const point of oldComponent.package.groups[index].pointsTo) {
        if (point.input === 'A') {
          context.setGateA(oldComponent.net + point.gate, newInput.net);
        } else {
          context.setGateB(oldComponent.net + point.gate, newInput.net);
        }
      }
    }
  }

  context.updateText(oldComponent, newComponent);
}
