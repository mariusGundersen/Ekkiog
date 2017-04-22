import { isEmpty, Forest, Item, CompiledComponent, Direction, Tool } from 'ekkiog-editing';
import { vec2, mat3 } from 'gl-matrix';
import { Dispatch } from 'redux';

import { State } from './reduce';

export interface Meta {
  emit? : boolean,
  dispatch? : boolean
}

export type Dispatch = Dispatch<State>;


export type ResizeAction = {
  readonly type : 'resize',
  readonly pixelWidth : number,
  readonly pixelHeight : number
}
export const resize = (pixelWidth : number, pixelHeight : number) : ResizeAction => ({
  type: 'resize',
  pixelWidth,
  pixelHeight
});

export type InitGlAction = {
  readonly type : 'gl',
  readonly gl : WebGLRenderingContext
}
export const initGl = (gl : WebGLRenderingContext) : InitGlAction => ({
  type: 'gl',
  gl
});

export type SetForestAction = {
  readonly type : 'set-forest',
  readonly name : string,
  readonly forest : Forest
}
export const setForest = (name : string, forest : Forest) : SetForestAction => ({
  type: 'set-forest',
  name,
  forest
});

export type PanZoomAction = {
  readonly type : 'panZoom',
  readonly tileToViewport : (...pos : number[]) => [number, number]
}
export const panZoom = (tileToViewport : (...pos : number[]) => [number, number]) : PanZoomAction => ({
  type: 'panZoom',
  tileToViewport
});

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
  readonly tile : string,
  readonly tx : number,
  readonly ty : number
}
export const showContextMenu = (tile : string, tx : number, ty : number) :ShowContextMenuAction => ({
  type: 'showContextMenu',
  tile,
  tx,
  ty
});

export type HideContextMenuAction = {
  readonly type : 'hideContextMenu',
  readonly meta : Meta
}
export const hideContextMenu = () : HideContextMenuAction => ({
  type: 'hideContextMenu',
  meta: {
    emit: true,
    dispatch: true
  }
});

export type SetSelectedToolAction = {
  readonly type : 'setSelectedTool',
  readonly tool : Tool
}
export const setSelectedTool = (tool : Tool) : SetSelectedToolAction => ({
  type: 'setSelectedTool',
  tool
});

export type SetToolDirectionAction = {
  readonly type : 'setToolDirection',
  readonly direction : Direction
}
export const setToolDirection = (direction : Direction) : SetToolDirectionAction => ({
  type: 'setToolDirection',
  direction
});

export type ToggleEditorMenuAction = {
  type: 'toggleEditorMenu'
}
export const toggleEditorMenu = () : ToggleEditorMenuAction => ({
  type: 'toggleEditorMenu'
});

export type ShowOkCancelMenuAction = {
  readonly type : 'showOkCancelMenu',
  okAction() : void,
  cancelAction() : void
}
export const showOkCancelMenu = (okAction : () => void, cancelAction : () => void) : ShowOkCancelMenuAction => ({
  type: 'showOkCancelMenu',
  okAction,
  cancelAction
});

export type SetOkCancelMenuValidAction = {
  readonly type : 'setOkCancelMenuValid',
  readonly isValid : boolean
}
export const setOkCancelMenuValid = (isValid : boolean) : SetOkCancelMenuValidAction => ({
  type: 'setOkCancelMenuValid',
  isValid
});

export type ResetEditorMenuAction = {
  type  : 'resetEditorMenu'
}
export const resetEditorMenu = () => ({
  type: 'resetEditorMenu'
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
export const insertComponent = (component : CompiledComponent, position : {x : number, y : number}, selection : {dx : number, dy : number}) : InsertComponentAction => ({
  type: 'insert-component',
  component,
  position: {
    x: (position.x|0) + selection.dx,
    y: (position.y|0) + selection.dy
  }
});

export type SelectComponentAction = {
  readonly type : 'selectComponent',
  readonly component : CompiledComponent,
  readonly position : {
    readonly x : number,
    readonly y : number
  }
}
export const selectComponent = (component : CompiledComponent, position : {x : number, y : number}) : SelectComponentAction => ({
  type: 'selectComponent',
  component,
  position
});

export type MoveSelectionAction = {
  readonly type : 'moveSelection',
  readonly dx : number,
  readonly dy : number
}
export const moveSelection = (dx : number, dy : number) : MoveSelectionAction => ({
  type: 'moveSelection',
  dx,
  dy
});

export type StopSelectionAction = {
  readonly type : 'stopSelection',
  readonly meta : Meta
}
export const stopSelection = () : StopSelectionAction => ({
  type: 'stopSelection',
  meta: {
    emit: true,
    dispatch: true
  }
});


export type ContextMenuActions =
  LoadContextMenuAction |
  AbortLoadContextMenuAction |
  ShowContextMenuAction |
  HideContextMenuAction |
  PanZoomAction;

export type EditorActions =
  SetSelectedToolAction |
  SetToolDirectionAction |
  SetForestAction;

export type EditorMenuActions =
  ShowContextMenuAction |
  HideContextMenuAction |
  ToggleEditorMenuAction |
  ShowOkCancelMenuAction |
  SetOkCancelMenuValidAction |
  ResetEditorMenuAction;

export type ForestActions =
  SetForestAction |
  TapTileAction |
  RemoveTileAtAction |
  ToUnderpassAction |
  ToWireAction |
  InsertComponentAction;

export type GlobalActions =
  InitGlAction |
  ResizeAction |
  SetForestAction;

export type SelectionActions =
  SelectComponentAction |
  MoveSelectionAction |
  StopSelectionAction;

export type ViewActions =
  ResizeAction;

export type Action =
  ContextMenuActions |
  EditorActions |
  EditorMenuActions |
  ForestActions |
  GlobalActions |
  ViewActions;








export type StartSelectionAction = {
  readonly type : 'startSelection',
  readonly meta : Meta,
  readonly top : number,
  readonly left : number,
  readonly right : number,
  readonly bottom : number
}
export const startSelection = (top : number, left : number, right : number, bottom : number) : StartSelectionAction => ({
  type: 'startSelection',
  meta: {
    emit: true
  },
  top,
  left,
  right,
  bottom
});

export const insertComponentPackage = (componentPackage : CompiledComponent) => (dispatch : Dispatch<State>, getState : () => State) => {
  const state = getState();
  const tile = state.global.perspective.viewportToTileFloored(state.view.pixelWidth/2, state.view.pixelHeight/2);
  const centerTile = {
    x: tile[0],
    y: tile[1]
  };
  const top = centerTile.y - (componentPackage.height>>1);
  const left = centerTile.x - (componentPackage.width>>1);
  const right = centerTile.x - (componentPackage.width>>1) + componentPackage.width;
  const bottom = centerTile.y - (componentPackage.height>>1) + componentPackage.height;

  if(state.selection.selection){
    dispatch(stopSelection());
    dispatch(resetEditorMenu());
  }

  dispatch(showOkCancelMenu(
    () => {
      const selection = getState().selection;
      if(selection.selection == false) return;
      dispatch(insertComponent(componentPackage, centerTile, selection));
      dispatch(stopSelection());
      dispatch(resetEditorMenu());
    },
    () => {
      dispatch(stopSelection());
      dispatch(resetEditorMenu());
    }
  ));
  const isValid = isEmpty(state.forest.enneaTree, top, left, right, bottom);
  dispatch(setOkCancelMenuValid(isValid));
  dispatch(startSelection(top, left, right, bottom));
  dispatch(selectComponent(componentPackage, centerTile));
}


export const hideContextMenuAfter = (action : Action) => (dispatch : Dispatch<State>) => {
  dispatch(action);
  dispatch(hideContextMenu());
};