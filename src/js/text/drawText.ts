import Context from '../Context';

import sprites from './sprites';

export default function drawText(x : number, y : number, context : Context, text : string){
  let i=0;
  for(const sprite of sprites(text)){
    context.wordQuadList.set(i, {
      pos: {x, y, w: sprite.w, h: sprite.h},
      uv: sprite
    });
    x += sprite.w+1;
    i++;
  }
  context.wordQuadList.update(text.length);
}