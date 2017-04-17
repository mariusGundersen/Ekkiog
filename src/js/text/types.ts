export interface Sprite {
  x : number,
  y : number,
  w : number,
  h : number
}

export interface CharacterSprite extends Sprite {
  s : number
};

export type Quad = {
  uv : CharacterSprite,
  pos : Sprite
};
