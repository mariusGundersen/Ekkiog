import { Forest, Box } from 'ekkiog-editing';

export type NewContextLoadingAction = {
  readonly type : 'new-context-loading',
  readonly name : string
}
export const newContextLoading = (name : string) : NewContextLoadingAction => ({
  type: 'new-context-loading',
  name
});

export type ForestLoadedAction = {
  readonly type : 'forest-loaded',
  readonly forest : Forest
}
export const forestLoaded = (forest : Forest) : ForestLoadedAction => ({
  type: 'forest-loaded',
  forest
});

export type PushContextLoadingAction = {
  readonly type : 'push-context-loading',
  readonly name : string,
  readonly boundingBox : Box,
  readonly centerX : number,
  readonly centerY : number
}
export const pushContextLoading = (name : string, boundingBox : Box, centerX : number, centerY : number) : PushContextLoadingAction => ({
  type: 'push-context-loading',
  name,
  boundingBox,
  centerX,
  centerY
});

export type PopContextAction = {
  readonly type : 'pop-context'
}
export const popContext = () : PopContextAction => ({
  type: 'pop-context'
});

export type UndoAction = {
  readonly type : 'undo-context'
}
export const undo = () : UndoAction => ({
  type: 'undo-context'
});

export type RedoAction = {
  readonly type : 'redo-context'
}
export const redo = () : RedoAction => ({
  type: 'redo-context'
});

export type ContextActions =
  NewContextLoadingAction |
  ForestLoadedAction |
  PushContextLoadingAction |
  PopContextAction |
  UndoAction |
  RedoAction;
