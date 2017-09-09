import {
  Forest,
  Tool,
  Direction,
  CompiledComponent,
  Item,
  BoxArea,
  BuddyNode
} from 'ekkiog-editing';

export type SetForestAction = {
  readonly type : 'set-forest',
  readonly forest : Forest
}
export const setForest = (forest : Forest) : SetForestAction => ({
  type: 'set-forest',
  forest
});


export type TapTileAction = {
  readonly type : 'tap-tile',
  readonly x : number,
  readonly y : number,
  readonly tool : Tool,
  readonly direction : Direction
}
export const tapTile = (tx : number, ty : number, tool : Tool, direction : Direction) : TapTileAction => ({
  type: 'tap-tile',
  x: tx,
  y: ty,
  tool,
  direction
});

export type RemoveTileAtAction = {
  readonly type : 'remove-tile-at',
  readonly x : number,
  readonly y : number
}
export const removeTileAt = (tx : number, ty : number) : RemoveTileAtAction => ({
  type: 'remove-tile-at',
  x: tx,
  y: ty
});

export type ToUnderpassAction = {
  readonly type : 'convert-wire-to-underpass',
  readonly x : number,
  readonly y : number
}
export const toUnderpass = (tx : number, ty : number) : ToUnderpassAction => ({
  type: 'convert-wire-to-underpass',
  x: tx,
  y: ty
});

export type ToWireAction = {
  readonly type : 'convert-underpass-to-wire',
  readonly x : number,
  readonly y : number
}
export const toWire = (tx : number, ty : number) : ToWireAction => ({
  type: 'convert-underpass-to-wire',
  x: tx,
  y: ty
});

export type InsertComponentAction = {
  readonly type : 'insert-component',
  readonly component : CompiledComponent,
  readonly position : {
    readonly x : number,
    readonly y : number
  }
}
export const insertComponent = (component : CompiledComponent, position : {x : number, y : number}) : InsertComponentAction => ({
  type: 'insert-component',
  component,
  position
});

export type InsertItemAction = {
  readonly type : 'insert-item',
  readonly item : Item,
  readonly position : BoxArea,
  readonly buddyTree : BuddyNode
}
export const insertItem = (item : Item, position : BoxArea, buddyTree : BuddyNode) : InsertItemAction => ({
  type: 'insert-item',
  item,
  position,
  buddyTree
});

export type ForestActions =
  SetForestAction |
  TapTileAction |
  RemoveTileAtAction |
  ToUnderpassAction |
  ToWireAction |
  InsertComponentAction |
  InsertItemAction;