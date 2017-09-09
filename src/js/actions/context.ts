import { Forest, Box } from 'ekkiog-editing';

export type NewContextLoadingAction = {
  readonly type : 'new-context-loading',
  readonly repo : string
  readonly name : string
  readonly version : string
}
export const newContextLoading = (repo : string, name : string, version : string) : NewContextLoadingAction => ({
  type: 'new-context-loading',
  repo,
  name,
  version
});

export type ForestLoadedAction = {
  readonly type : 'forest-loaded',
  readonly forest : Forest,
  readonly hash : string
}
export const forestLoaded = (forest : Forest, hash : string) : ForestLoadedAction => ({
  type: 'forest-loaded',
  forest,
  hash
});

export type PushContextLoadingAction = {
  readonly type : 'push-context-loading',
  readonly repo : string,
  readonly name : string,
  readonly version : string,
  readonly boundingBox : Box,
  readonly centerX : number,
  readonly centerY : number
}
export const pushContextLoading = (repo : string, name : string, version : string, boundingBox : Box, centerX : number, centerY : number) : PushContextLoadingAction => ({
  type: 'push-context-loading',
  repo,
  name,
  version,
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

export type ForestSavedAction = {
  readonly type : 'forest-saved'
  readonly hash : string
}
export const forestSaved = (hash : string) : ForestSavedAction => ({
  type: 'forest-saved',
  hash
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
  ForestSavedAction |
  UndoAction |
  RedoAction;
