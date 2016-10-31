import {
  EMPTY,
  WIRE,
  GATE,
  UNDERPASS,
  BUTTON
} from '../tileConstants.js';

const GROUND = 0;

export default function clear(context, {top, left, width, height}){
  for(let y=top; y<top+height; y++){
    for(let x=left; x<left+width; x++){
      context.mapTexture.set(x, y, EMPTY);
      context.netMapTexture.set(x, y, GROUND);
    }
  }
}