import { Tool } from 'ekkiog-editing';

export type LoadContextMenuAction = {
  readonly type : 'loadContextMenu',
  readonly x : number,
  readonly y : number
}
export const loadContextMenu = (x : number, y : number) : LoadContextMenuAction => ({
  type: 'loadContextMenu',
  x,
  y
});

export type AbortLoadContextMenuAction = {
  readonly type : 'abortLoadContextMenu'
}
export const abortLoadContextMenu = () : AbortLoadContextMenuAction => ({
  type: 'abortLoadContextMenu'
});

export type ShowContextMenuAction = {
  readonly type : 'showContextMenu',
  readonly tile : Tool | 'empty',
  readonly tx : number,
  readonly ty : number
}
export const showContextMenu = (tile : Tool | 'empty', tx : number, ty : number) : ShowContextMenuAction => ({
  type: 'showContextMenu',
  tile,
  tx,
  ty
});

export type HideContextMenuAction = {
  readonly type : 'hideContextMenu'
}
export const hideContextMenu = () : HideContextMenuAction => ({
  type: 'hideContextMenu'
});

export type ContextMenuActions =
  LoadContextMenuAction |
  AbortLoadContextMenuAction |
  ShowContextMenuAction |
  HideContextMenuAction;