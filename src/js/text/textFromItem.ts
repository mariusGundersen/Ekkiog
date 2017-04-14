import {
  Item,
  Area,
  Component,
  COMPONENT
} from 'ekkiog-editing';

import sprites, { CharacterSprite } from './sprites';


const TILE = 16;

export default function textFromItem(item : Item, area : Area){
  switch(item.type){
    case COMPONENT:
      return textFromComponent(item, area);
    default:
      return [];
  }
}

export function textFromComponent(component : Component, area : Area){
  if(component.name){
    const x = area.left + area.width/2;
    const y = area.top + area.height/2;
    const w = area.width - 2;
    const h = area.height - 2;
    const characters = [...sprites(component.name)];
    const {scale, length} = calculateScale(w, h, characters);
    return [...centerText(x, y, scale, length, characters)];
  }else{
    return [];
  }
}

export function* centerText(cx : number, cy : number, scale : number, length : number, characters : CharacterSprite[]){
  let x = cx - length/2*scale;
  for(const c of characters){
    yield {
      pos: {
        x: x,
        y: cy - c.h/TILE*scale/2,
        w: c.w/TILE*scale,
        h: c.h/TILE*scale,
      },
      uv : c
    };
    x += (c.w+1)/TILE*scale;
  }
}

export function calculateScale(w : number, h : number, characters : CharacterSprite[]){
  const length = characters.reduce((sum, l) => sum+(l.w+1), -1)/TILE;
  const scaleX = w/length;
  return {
    scale: Math.min(scaleX, h*2),
    length
  };
}