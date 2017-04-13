export interface CharacterSprite {
  x : number,
  y : number,
  w : number,
  h : number
}

export default function* sprites(text : string){
  for(const char of text){
    yield character(char);
  }
}

export function character(char : string){
  return characters.get(char) || characters.get(' ')  || {x: 0, y: 0, w: 0, h: 0};
}

const characters = new Map(createCharacteMap(0, 248, 8, [
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

function* createCharacteMap(x : number, y : number, h : number, charWidths : [string, number][]){
  for(const [c, w] of charWidths){
    yield [c, {
      x,
      y,
      w,
      h
    }] as [string, CharacterSprite];
    x += w;
  }
}