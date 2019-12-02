import { Forest, Box, TestScenario } from '../editing';

export type LoadForestAction = {
  readonly type: 'load-forest'
  readonly repo: string
  readonly name: string
  readonly hash?: string
}
export const loadForest = (repo: string, name: string, hash?: string): LoadForestAction => ({
  type: 'load-forest',
  repo,
  name,
  hash
});

export type SaveForestAction = {
  readonly type: 'save-forest'
  readonly message: string
}
export const saveForest = (message: string): SaveForestAction => ({
  type: 'save-forest',
  message
});


export type CreateForestAction = {
  readonly type: 'create-forest'
  readonly name: string
}
export const createForest = (name: string): CreateForestAction => ({
  type: 'create-forest',
  name
});

export type NewContextLoadingAction = {
  readonly type: 'new-context-loading',
  readonly repo: string
  readonly name: string
}
export const newContextLoading = (repo: string, name: string): NewContextLoadingAction => ({
  type: 'new-context-loading',
  repo,
  name
});

export type AbortContextLoadingAction = {
  readonly type: 'abort-context-loading'
}
export const abortContextLoading = (): AbortContextLoadingAction => ({
  type: 'abort-context-loading'
});

export type ForestLoadedAction = {
  readonly type: 'forest-loaded',
  readonly forest: Forest,
  readonly hash: string
  readonly isReadOnly: boolean
}
export const forestLoaded = (forest: Forest, hash: string, isReadOnly: boolean): ForestLoadedAction => ({
  type: 'forest-loaded',
  forest,
  hash,
  isReadOnly
});

export type ZoomIntoAction = {
  readonly type: 'zoom-into',
  readonly x: number,
  readonly y: number
}
export const zoomInto = (x: number, y: number): ZoomIntoAction => ({
  type: 'zoom-into',
  x,
  y
});

export type ZoomOutOfAction = {
  readonly type: 'zoom-out-of'
}
export const zoomOutOf = (): ZoomOutOfAction => ({
  type: 'zoom-out-of'
});

export type PushContextLoadingAction = {
  readonly type: 'push-context-loading',
  readonly repo: string,
  readonly name: string,
  readonly boundingBox: Box,
  readonly centerX: number,
  readonly centerY: number
}
export const pushContextLoading = (repo: string, name: string, boundingBox: Box, centerX: number, centerY: number): PushContextLoadingAction => ({
  type: 'push-context-loading',
  repo,
  name,
  boundingBox,
  centerX,
  centerY
});

export type PopContextAction = {
  readonly type: 'pop-context'
}
export const popContext = (): PopContextAction => ({
  type: 'pop-context'
});

export type ForestSavingAction = {
  readonly type: 'forest-saving'
}
export const forestSaving = (): ForestSavingAction => ({
  type: 'forest-saving'
});

export type ForestSavedAction = {
  readonly type: 'forest-saved'
  readonly hash: string
}
export const forestSaved = (hash: string): ForestSavedAction => ({
  type: 'forest-saved',
  hash
});

export type UndoAction = {
  readonly type: 'undo-context'
}
export const undo = (): UndoAction => ({
  type: 'undo-context'
});

export type RedoAction = {
  readonly type: 'redo-context'
}
export const redo = (): RedoAction => ({
  type: 'redo-context'
});

export type SetTestScenario = {
  readonly type: 'set-test-scenario'
  readonly testScenario: TestScenario
}

export type ContextActions =
  LoadForestAction |
  SaveForestAction |
  CreateForestAction |
  NewContextLoadingAction |
  AbortContextLoadingAction |
  ForestLoadedAction |
  ZoomIntoAction |
  ZoomOutOfAction |
  PushContextLoadingAction |
  PopContextAction |
  ForestSavedAction |
  ForestSavingAction |
  UndoAction |
  RedoAction |
  SetTestScenario;
