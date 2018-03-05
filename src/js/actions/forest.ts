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
export const tapTile = (x : number, y : number, tool : Tool, direction : Direction) : TapTileAction => ({
  type: 'tap-tile',
  x,
  y,
  tool,
  direction
});

export type DrawAction = {
  readonly type : 'draw',
  readonly x : number,
  readonly y : number,
  readonly tool : Tool,
  readonly direction : Direction
}
export const draw = (x : number, y : number, tool : Tool, direction : Direction) : DrawAction => ({
  type: 'draw',
  x,
  y,
  tool,
  direction
});

export type RemoveTileAtAction = {
  readonly type : 'remove-tile-at',
  readonly x : number,
  readonly y : number
}
export const removeTileAt = (x : number, y : number) : RemoveTileAtAction => ({
  type: 'remove-tile-at',
  x,
  y
});

export type ToUnderpassAction = {
  readonly type : 'convert-wire-to-underpass',
  readonly x : number,
  readonly y : number
}
export const toUnderpass = (x : number, y : number) : ToUnderpassAction => ({
  type: 'convert-wire-to-underpass',
  x,
  y
});

export type ToWireAction = {
  readonly type : 'convert-underpass-to-wire',
  readonly x : number,
  readonly y : number
}
export const toWire = (x : number, y : number) : ToWireAction => ({
  type: 'convert-underpass-to-wire',
  x,
  y
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

export type InsertComponentPackageAction = {
  readonly type : 'insert-component-package'
  readonly componentPackage : CompiledComponent
}
export const insertComponentPackage = (componentPackage : CompiledComponent) : InsertComponentPackageAction => ({
  type: 'insert-component-package',
  componentPackage
});

export type MoveItemAtAction = {
  readonly type : 'move-item-at'
  readonly x : number
  readonly y : number
}
export const moveItemAt = (x : number, y : number) : MoveItemAtAction => ({
  type: 'move-item-at',
  x,
  y
});

export type ToggleButtonAction = {
  readonly type : 'toggle-button'
  readonly net : number
}
export const toggleButton = (net : number) : ToggleButtonAction => ({
  type: 'toggle-button',
  net
});

export type SetItemNameAction = {
  readonly type : 'set-item-name'
  readonly x : number
  readonly y : number
  readonly name : string
}
export const setItemName = (x : number, y : number, name : string) : SetItemNameAction => ({
  type: 'set-item-name',
  x,
  y,
  name
});

export type ForestActions =
  SetForestAction |
  DrawAction |
  TapTileAction |
  RemoveTileAtAction |
  ToUnderpassAction |
  ToWireAction |
  InsertComponentAction |
  InsertItemAction |
  InsertComponentPackageAction |
  MoveItemAtAction |
  ToggleButtonAction |
  SetItemNameAction;