import { BoxArea, clear, BoxContext, get, set, update, Box } from 'ennea-tree';
import { EnneaTree, Item, Forest } from '../types';
import { makeFloodQueue } from './make';
import { WIRE, UNDERPASS, LIGHT, GATE, COMPONENT } from '../constants';
import { floodWire } from './wire';
import { floodUnderpass } from './underpass';
import { Context } from './types';
import { getUnderpassNeighbouringNets } from '../query/getNeighbouringNets';
import { makeWire } from '../actions/drawWire';
import light from './light';
import gate from './gate';
import component from './component';

export default function floodClear(forest: Forest, x: number, y: number): Forest {
  const item = get(forest.enneaTree, y, x);

  switch (item.data.type) {
    case WIRE:
    case UNDERPASS:
      return {
        ...forest,
        enneaTree: floodClearInternal(clear(forest.enneaTree, item).tree, [item.data, item])
      };
    default:
      return forest
  }
}

function floodClearInternal(enneaTree: EnneaTree, ...floodSources: [Item, BoxArea][]): EnneaTree {
  const queue = [...makeFloodQueue(true, floodSources)];

  for (const { area, context } of queue) {
    enneaTree = clearWire(enneaTree, area, context, queue);
  }

  return enneaTree;
}

function clearWire(oldTree: EnneaTree, area: Box, context: Context, queue: BoxContext<Context>[]) {
  const { tree: newTree, cleared: [item] } = clear(oldTree, area);

  if (!item) return newTree;

  const pos = { top: area.top - item.top, left: area.left - item.left };

  switch (item.data.type) {
    case WIRE:
      floodWire(context, queue);
      return newTree;
    case UNDERPASS:
      floodUnderpass(context, queue);
      const { vertical, horizontal } = getUnderpassNeighbouringNets(oldTree, item.left, item.top);
      const net = context.pos.top === context.prev.top ? vertical[0] : horizontal[0];

      if (net === undefined) return newTree;

      return set(newTree, makeWire(net), item);
    case LIGHT:
      return set(newTree, light(item.data, pos, context, queue), item);
    case GATE:
      return set(newTree, gate(item.data, pos, context, queue), item);
    case COMPONENT:
      return set(newTree, component(item.data, pos, context, queue), item);
    default:
      return oldTree;
  }
}

