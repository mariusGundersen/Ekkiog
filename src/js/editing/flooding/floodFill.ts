import {
  update,
  BoxArea
} from 'ennea-tree';

import {
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON,
  COMPONENT,
  LIGHT
} from '../constants';


import wire from './wire';
import gate from './gate';
import underpass from './underpass';
import button from './button';
import component from './component';
import light from './light';
import unchanged from './unchanged';

import {
  EnneaTree,
  Item,
  Forest
} from '../types';

import {
  Context
} from './types';

import { makeFloodQueue } from './make';

export default function floodFill({ enneaTree, buddyTree, testScenario }: Forest, item: Item, pos: BoxArea): Forest {
  return {
    enneaTree: floodFillInternal(enneaTree, false, [item, pos]),
    buddyTree,
    testScenario
  };
}

export function floodFillGround(enenaTree: EnneaTree, floodSources: [Item, BoxArea][]) {
  return floodFillInternal(enenaTree, true, ...floodSources);
}

function floodFillInternal(enneaTree: EnneaTree, isGround = false, ...floodSources: [Item, BoxArea][]): EnneaTree {
  const queue = [...makeFloodQueue(isGround, floodSources)];
  const updater = update(enneaTree, (old: Item, ctx: Context, pos) => {
    switch (old.type) {
      case WIRE:
        return wire(old, pos, ctx, queue);
      case GATE:
        return gate(old, pos, ctx, queue);
      case UNDERPASS:
        return underpass(old, pos, ctx, queue);
      case BUTTON:
        return button(old, pos, ctx, queue);
      case COMPONENT:
        return component(old, pos, ctx, queue);
      case LIGHT:
        return light(old, pos, ctx, queue);
      default:
        return old;
    }
  }, unchanged);
  return updater.result(queue);
}

