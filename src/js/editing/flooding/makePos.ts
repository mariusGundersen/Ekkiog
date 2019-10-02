import { Pos, BoxContext } from 'ennea-tree';

import {
  Context
} from './types';

export default function makePos({ top, left }: Pos, net: number, dx = 0, dy = 0): BoxContext<Context> {
  return {
    area: {
      top: top + dy,
      left: left + dx,
      right: left + dx + 1,
      bottom: top + dy + 1
    },
    context: {
      net,
      pos: {
        top: top + dy,
        left: left + dx
      },
      prev: {
        top,
        left
      }
    }
  };
}
