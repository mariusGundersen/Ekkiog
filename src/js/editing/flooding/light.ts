import { Pos, BoxContext } from 'ennea-tree';

import {
  UPWARDS,
  LEFTWARDS,
  RIGHTWARDS,
  DOWNWARDS
} from '../constants';

import {
  Context
} from './types';

import {
  Light
} from '../types';

export default function light(oldLight: Light, pos: Pos, ctx: Context, queue: BoxContext<Context>[]): Light {
  const net = ctx.net;

  if (net === oldLight.net) {
    return oldLight;
  }

  const x = pos.left;
  const y = pos.top;
  const dx = ctx.pos.left - ctx.prev.left;
  const dy = ctx.pos.top - ctx.prev.top;
  switch (oldLight.direction) {
    case UPWARDS:
      return (x === 1 && y === 2 && dx === 0 && dy === -1)
        ? { ...oldLight, net }
        : oldLight;
    case DOWNWARDS:
      return (x === 1 && y === 0 && dx === 0 && dy === 1)
        ? { ...oldLight, net }
        : oldLight;
    case LEFTWARDS:
      return (x === 2 && y === 1 && dx === -1 && dy === 0)
        ? { ...oldLight, net }
        : oldLight;
    case RIGHTWARDS:
    default:
      return (x === 0 && y === 1 && dx === 1 && dy === 0)
        ? { ...oldLight, net }
        : oldLight;
  }
}
