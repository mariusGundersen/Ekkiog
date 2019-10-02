import {
  Item,
  Wire,
  Gate,
  Underpass,
  Button,
  Component,
  Light
} from '../types';

import {
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,
  COMPONENT,
  LIGHT,
  GROUND
} from '../constants';

export default function unchanged(before: Item, after: Item): boolean {
  switch (before.type) {
    case WIRE: return wire(before, after as Wire);
    case GATE: return gate(before, after as Gate);
    case UNDERPASS: return underpass(before, after as Underpass);
    case BUTTON: return button(before, after as Button);
    case COMPONENT: return component(before, after as Component);
    case LIGHT: return light(before, after as Light);
  }
}

function wire(before: Wire, after: Wire) {
  return before.net === after.net;
}

function gate(before: Gate, after: Gate) {
  return before.inputA === after.inputA
    && before.inputB === after.inputB
    && before.net === after.net;
}

function underpass(before: Underpass, after: Underpass) {
  return before.net === after.net;
}

function button(before: Button, after: Button) {
  return before.net === after.net
    && before.direction === after.direction
    && before.name === after.name;
}

function light(before: Light, after: Light) {
  return before.net === after.net
    && before.direction === after.direction
    && before.name === after.name;
}

function component(before: Component, after: Component) {
  if (before.package.name !== after.package.name) return false;
  if (before.package.hash !== after.package.hash) return false;
  if (before.inputs !== after.inputs && !before.inputs.every((e, i) => e.net === after.inputs[i].net)) return false;
  return true;
}
