import { Pos, BoxContext } from 'ennea-tree';

import makePos from './makePos';

import {
  Context
} from './types';

import {
  Component
} from '../types';

import {
  GROUND
} from '../constants';

export default function component(oldComponent : Component, pos : Pos, ctx : Context, queue : BoxContext<Context>[]) : Component{
  const inputIndex = oldComponent.package.inputs.findIndex(pin => pin.x === pos.left && pin.y === pos.top);
  if(inputIndex >= 0){
    const input = oldComponent.package.inputs[inputIndex];
    const pins = oldComponent.package.inputs.filter(pin => pin.group === input.group);

    if(ctx.net !== GROUND){
      const group = oldComponent.inputs.find((_, index) => index === input.group);
      if(group && group.net !== GROUND && group.net !== ctx.net){
        throw new Error();
      }
    }

    const inputs = oldComponent.inputs.map((pin, index) => index === input.group
      ? {
        ...pin,
        input: ctx.net === GROUND ? -1 : pins.indexOf(input),
        net: ctx.net
      }
      : pin);

    queue.push(...pins
      .filter(pin => pin !== input)
      .map(pin => makePos({top: ctx.pos.top+(pin.y - input.y), left: ctx.pos.left+(pin.x - input.x)}, ctx.net, pin.dx, pin.dy)));

    return {
      ...oldComponent,
      inputs
    };
  }

  const outputIndex = oldComponent.package.outputs.findIndex(pin => pin.x === pos.left && pin.y === pos.top);
  if(outputIndex >= 0){
    const pin = oldComponent.package.outputs[outputIndex];
    const output = oldComponent.outputs[outputIndex];
    if(output.net !== GROUND && ctx.net === GROUND){
      queue.push(makePos(ctx.pos, output.net, pin.dx, pin.dy));
    }else if(output.net !== GROUND && ctx.net !== GROUND && output.net !== ctx.net){
      throw new Error();
    }
  }

  return oldComponent;
}
