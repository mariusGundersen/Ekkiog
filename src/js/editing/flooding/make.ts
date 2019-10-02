import { BoxContext, BoxArea } from 'ennea-tree';
import { WIRE, GATE, UNDERPASS, BUTTON, COMPONENT, GROUND } from '../constants';
import makePos from './makePos';
import { Item } from '../types';
import { Context } from './types';
import { directionToDx, directionToDy, zip } from '../utils';

export function* makeFloodQueue(isGround: boolean, sources: [Item, BoxArea][]): IterableIterator<BoxContext<Context>> {
  for (const [item, pos] of sources) {
    switch (item.type) {
      case WIRE:
        yield makePos({ top: pos.top, left: pos.left }, isGround ? GROUND : item.net, 0, 1);
        yield makePos({ top: pos.top, left: pos.left }, isGround ? GROUND : item.net, 1, 0);
        yield makePos({ top: pos.top, left: pos.left }, isGround ? GROUND : item.net, 0, -1);
        yield makePos({ top: pos.top, left: pos.left }, isGround ? GROUND : item.net, -1, 0);
        break;
      case GATE:
        yield makePos({ top: pos.top + 1, left: pos.left + 3 }, isGround ? GROUND : item.net, 1, 0);
        break;
      case UNDERPASS:
        yield makePos({ top: pos.top, left: pos.left }, isGround ? GROUND : item.net, 1, 0);
        yield makePos({ top: pos.top, left: pos.left }, isGround ? GROUND : item.net, -1, 0);
        yield makePos({ top: pos.top, left: pos.left }, GROUND, 0, 1);
        yield makePos({ top: pos.top, left: pos.left }, GROUND, 0, -1);
        break;
      case BUTTON:
        const dx = directionToDx(item.direction);
        const dy = directionToDy(item.direction);
        yield makePos({ top: pos.top + 1 + dy, left: pos.left + 1 + dx }, isGround ? GROUND : item.net, dx, dy);
        break;
      case COMPONENT:
        for (const [output, pin] of zip(item.outputs, item.package.outputs)) {
          yield makePos({ top: pos.top + pin.y, left: pos.left + pin.x }, isGround ? GROUND : output.net, pin.dx, pin.dy);
        }
        for (const pin of item.package.inputs) {
          const input = item.inputs[pin.group];
          if (input.input !== item.package.inputs.filter(input => input.group === pin.group).indexOf(pin)) {
            yield makePos({ top: pos.top + pin.y, left: pos.left + pin.x }, isGround ? GROUND : input.net, pin.dx, pin.dy);
          }
        }
        break;
    }
  }
}
