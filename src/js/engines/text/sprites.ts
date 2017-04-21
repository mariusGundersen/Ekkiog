import { CharacterSprite } from './types';

export function* spritesFlat(text : string){
  for(const char of text){
    yield fontFlat.get(char.toUpperCase()) || {x: 0, y: 0, w: 0, h: 0, s:0};
  }
}

export function* spritesThick(text : string){
  for(const char of text){
    yield fontThick.get(char.toUpperCase()) || {x: 0, y: 0, w: 0, h: 0, s:0};
  }
}

const fontThick = new Map(createCharacteMap(0, 240, 8, -1, [
  ['A', 7],
  ['B', 7],
  ['C', 7],
  ['D', 7],
  ['E', 7],
  ['F', 7],
  ['G', 7],
  ['H', 7],
  ['I', 4],
  ['J', 7],
  ['K', 7],
  ['L', 7],
  ['M', 9],
  ['N', 8],
  ['O', 7],
  ['P', 7],
  ['Q', 8],
  ['R', 7],
  ['S', 7],
  ['T', 6],
  ['U', 7],
  ['V', 7],
  ['W', 9],
  ['X', 7],
  ['Y', 8],
  ['Z', 6],
  ['0', 7],
  ['1', 5],
  ['2', 7],
  ['3', 7],
  ['4', 7],
  ['5', 6],
  ['6', 7],
  ['7', 7],
  ['8', 7],
  ['9', 7],
  ['-', 5]
]));

const fontFlat = new Map(createCharacteMap(0, 248, 8, 1, [
  ['A', 7],
  ['B', 7],
  ['C', 7],
  ['D', 7],
  ['E', 6],
  ['F', 6],
  ['G', 7],
  ['H', 7],
  ['I', 6],
  ['J', 7],
  ['K', 7],
  ['L', 6],
  ['M', 7],
  ['N', 7],
  ['O', 7],
  ['P', 7],
  ['Q', 7],
  ['R', 7],
  ['S', 7],
  ['T', 6],
  ['U', 7],
  ['V', 7],
  ['W', 7],
  ['X', 7],
  ['Y', 6],
  ['Z', 7],
  ['0', 7],
  ['1', 6],
  ['2', 7],
  ['3', 7],
  ['4', 7],
  ['5', 7],
  ['6', 7],
  ['7', 7],
  ['8', 7],
  ['9', 7],
  ['-', 5],
  [' ', 4]
]));

function* createCharacteMap(x : number, y : number, h : number, s : number, charWidths : [string, number][]){
  for(const [c, w] of charWidths){
    yield [c, {
      x,
      y,
      w,
      h,
      s
    }] as [string, CharacterSprite];
    x += w;
  }
}