import {
  Item,
  Area,
  Component,
  COMPONENT
} from '../../editing';

import { Quad, CharacterSprite, Sprite } from './types';

import { spritesFlat, spritesThick } from './sprites';
import { zip } from '../../utils/zip';


const TILE = 16;

export default function textFromItem(item: Item, area: Area): Quad[] {
  switch (item.type) {
    case COMPONENT:
      return [...textFromComponent(item, area)];
    default:
      return [];
  }
}

export function* textFromComponent(component: Component, area: Area): IterableIterator<Quad> {
  if (component.package.name) {
    const characters = [...spritesFlat(component.package.name)];
    yield* textPos(area.left + 1, area.top + 1, area.width - 2, area.height - 2, characters);
    for (const [input, pin] of zip(component.inputs, component.package.inputs)) {
      if (input.name) {
        const characters = [...spritesThick(input.name)];
        yield* textPos(pin.x + area.left, pin.y + area.top, 1, 1, characters);
      }
    }
    for (const [output, pin] of zip(component.outputs, component.package.outputs)) {
      if (output.name) {
        const characters = [...spritesThick(output.name)];
        yield* textPos(pin.x + area.left, pin.y + area.top, 1, 1, characters);
      }
    }
  } else {
    return;
  }
}

export function* textPos(left: number, top: number, width: number, height: number, characters: CharacterSprite[]): IterableIterator<Quad> {
  const x = left + width / 2;
  const y = top + height / 2;
  const w = width;
  const h = height;
  const { scale, length } = calculateScale(w, h, characters);
  yield* centerText(x, y, scale, length, characters);
}

export function* centerText(cx: number, cy: number, scale: number, length: number, characters: CharacterSprite[]): IterableIterator<Quad> {
  let x = cx - length / 2 * scale;
  for (const c of characters) {
    yield {
      pos: {
        x: x,
        y: cy - c.h / TILE * scale / 2,
        w: c.w / TILE * scale,
        h: c.h / TILE * scale,
      },
      uv: c
    };
    x += (c.w + c.s) / TILE * scale;
  }
}

export function calculateScale(w: number, h: number, characters: CharacterSprite[]) {
  const length = characters.reduce((sum, l) => sum + (l.w + l.s), 0) / TILE;
  const scaleX = w / length;
  return {
    scale: Math.min(scaleX, h * 2),
    length
  };
}
