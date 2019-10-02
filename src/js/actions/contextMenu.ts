export type LoadContextMenuAction = {
  readonly type: 'loadContextMenu',
  readonly tx: number,
  readonly ty: number
}
export const loadContextMenu = (tx: number, ty: number): LoadContextMenuAction => ({
  type: 'loadContextMenu',
  tx,
  ty
});

export type AbortLoadContextMenuAction = {
  readonly type: 'abortLoadContextMenu'
}
export const abortLoadContextMenu = (): AbortLoadContextMenuAction => ({
  type: 'abortLoadContextMenu'
});

export type ShowContextMenuAction = {
  readonly type: 'showContextMenu'
}
export const showContextMenu = (): ShowContextMenuAction => ({
  type: 'showContextMenu'
});

export type HideContextMenuAction = {
  readonly type: 'hideContextMenu'
}
export const hideContextMenu = (): HideContextMenuAction => ({
  type: 'hideContextMenu'
});

export type ContextMenuActions =
  LoadContextMenuAction |
  AbortLoadContextMenuAction |
  ShowContextMenuAction |
  HideContextMenuAction;
