import {
  EMPTY,
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON
} from '../tileConstants.js';

const GROUND = 0;

export default function set(context, change){
  switch(change.after.type){
    case 'wire':
      return setWire(context, change, change.after);
    case 'gate':
      return setGate(context, change, change.after);
    case 'button':
      return setButton(context, change, change.after);
  }
}

export function setWire(context, {top:y, left:x}, wire){
  context.mapTexture.set(x, y, WIRE);
  context.netMapTexture.set(x, y, wire.net);
}

export function setGate(context, {top, left, width, height}, gate){
  const x = left+3;
  const y = top+1;
  context.mapTexture.set(x, y, GATE);
  context.netMapTexture.set(x, y, gate.net);

  context.netMapTexture.set(x-3, y-1, context.netMapTexture.get(x-4, y-1));
  context.netMapTexture.set(x-3, y+1, context.netMapTexture.get(x-4, y+1));
}

export function setButton(context, {top, left, width, height}, button){
  const x = left+2;
  const y = top+1;

  context.mapTexture.set(x, y, BUTTON);
  context.netMapTexture.set(x, y, button.net);
  context.netMapTexture.set(x-1, y, button.net);
}