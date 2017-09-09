import { read } from 'fs';
import { Forest, Box } from 'ekkiog-editing';

export type LoadForestAction = {
  readonly type : 'load-forest'
  readonly repo : string
  readonly name : string
  readonly version : string
}
export const loadForest = (repo : string, name : string, version : string) : LoadForestAction => ({
  type: 'load-forest',
  repo,
  name,
  version
});

export type SaveForestAction = {
  readonly type : 'save-forest'
  readonly message : string
}
export const saveForest = (message : string) : SaveForestAction => ({
  type: 'save-forest',
  message
});

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

export type DoubleTapAction = {
  readonly type : 'double-tap',
  readonly x : number,
  readonly y : number
}
export const doubleTap = (x : number, y : number) : DoubleTapAction => ({
  type: 'double-tap',
  x,
  y
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
  LoadForestAction |
  SaveForestAction |
  NewContextLoadingAction |
  ForestLoadedAction |
  DoubleTapAction |
  PushContextLoadingAction |
  PopContextAction |
  ForestSavedAction |
  UndoAction |
  RedoAction;
