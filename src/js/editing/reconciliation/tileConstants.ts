export const EMPTY_TILE = tile(0, 0);
export const WIRE_TILE = tile(1, 0);
export const UNDERPASS_TILE = tile(2, 0);
export const GATE_TILE = tile(9, 4);
export const BUTTON_TILE = tile(9, 0);
export const BUTTON_OUTPUT_TILE = tile(9, 3);
export const COMPONENT_TILE = tile(1, 8);
export const LIGHT_TILE = tile(12, 0);
export const LIGHT_INPUT_TILE = tile(9, 7);

export function tile(x : number, y : number) : number{
  return x|(y<<8);
}