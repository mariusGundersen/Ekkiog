import {
  Forest,
  Tool,
  Direction,
  Package,
  Item,
  BoxArea,
  BuddyTree
} from '../editing';

export type SetForestAction = {
  readonly type: 'set-forest',
  readonly forest: Forest
}
export const setForest = (forest: Forest): SetForestAction => ({
  type: 'set-forest',
  forest
});

export type DoubleTapTileAction = {
  readonly type: 'double-tap-tile',
  readonly x: number,
  readonly y: number
}
export const doubleTapTile = (x: number, y: number): DoubleTapTileAction => ({
  type: 'double-tap-tile',
  x,
  y
});

export type TapTileAction = {
  readonly type: 'tap-tile',
  readonly x: number,
  readonly y: number
}
export const tapTile = (x: number, y: number): TapTileAction => ({
  type: 'tap-tile',
  x,
  y
});

export type DrawAction = {
  readonly type: 'draw',
  readonly x: number,
  readonly y: number,
  readonly tool: Tool,
  readonly direction: Direction
}
export const draw = (tx: number, ty: number, tool: Tool, direction: Direction): DrawAction => ({
  type: 'draw',
  x: tx,
  y: ty,
  tool,
  direction
});

export type RemoveTileAtAction = {
  readonly type: 'remove-tile-at',
  readonly x: number,
  readonly y: number
}
export const removeTileAt = (tx: number, ty: number): RemoveTileAtAction => ({
  type: 'remove-tile-at',
  x: tx,
  y: ty
});

export type FloodClearAtAction = {
  readonly type: 'flood-clear-at',
  readonly x: number,
  readonly y: number
}
export const floodClearAt = (tx: number, ty: number): FloodClearAtAction => ({
  type: 'flood-clear-at',
  x: tx,
  y: ty
});

export type ToUnderpassAction = {
  readonly type: 'convert-wire-to-underpass',
  readonly x: number,
  readonly y: number
}
export const toUnderpass = (tx: number, ty: number): ToUnderpassAction => ({
  type: 'convert-wire-to-underpass',
  x: tx,
  y: ty
});

export type ToWireAction = {
  readonly type: 'convert-underpass-to-wire',
  readonly x: number,
  readonly y: number
}
export const toWire = (tx: number, ty: number): ToWireAction => ({
  type: 'convert-underpass-to-wire',
  x: tx,
  y: ty
});

export type InsertComponentAction = {
  readonly type: 'insert-component',
  readonly component: Package,
  readonly position: {
    readonly x: number,
    readonly y: number
  }
}
export const insertComponent = (component: Package, position: { x: number, y: number }): InsertComponentAction => ({
  type: 'insert-component',
  component,
  position
});

export type InsertComponentPackageAction = {
  readonly type: 'insert-component-package'
  readonly componentPackage: Package
}
export const insertComponentPackage = (componentPackage: Package): InsertComponentPackageAction => ({
  type: 'insert-component-package',
  componentPackage
});

export type MoveItemAtAction = {
  readonly type: 'move-item-at'
  readonly tx: number
  readonly ty: number
}
export const moveItemAt = (tx: number, ty: number): MoveItemAtAction => ({
  type: 'move-item-at',
  tx,
  ty
});

export type ToggleButtonAction = {
  readonly type: 'toggle-button'
  readonly net: number
}
export const toggleButton = (net: number): ToggleButtonAction => ({
  type: 'toggle-button',
  net
});

export type RotateTileAtAction = {
  readonly type: 'rotate-tile-at',
  readonly x: number,
  readonly y: number,
  readonly direction: Direction
}
export const rotateTileAt = (tx: number, ty: number, direction: Direction): RotateTileAtAction => ({
  type: 'rotate-tile-at',
  x: tx,
  y: ty,
  direction
});


export type ForestActions =
  SetForestAction |
  DrawAction |
  TapTileAction |
  DoubleTapTileAction |
  RemoveTileAtAction |
  FloodClearAtAction |
  ToUnderpassAction |
  ToWireAction |
  InsertComponentAction |
  InsertComponentPackageAction |
  MoveItemAtAction |
  ToggleButtonAction |
  RotateTileAtAction;
