import { isEmpty, drawComponent, createForest, Forest, Item, CompiledComponent, Direction, Tool, Box, COMPONENT, Area } from 'ekkiog-editing';
import { get as getTileAt } from 'ennea-tree';
import { vec2, mat3 } from 'gl-matrix';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { State } from './reduce';
import { copyTo } from './reducers/forest';
import storage from './storage';
import getComponentBoundingBox from './utils/getComponentBoundingBox';

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

export type SetForestAction = {
  readonly type : 'set-forest',
  readonly name : string,
  readonly forest : Forest,
  readonly boundingBox : Box
}
export const setForest = (name : string, forest : Forest, boundingBox : Box) : SetForestAction => ({
  type: 'set-forest',
  name,
  forest,
  boundingBox
});

export type PushEditorAction = {
  readonly type : 'push-editor',
  readonly name : string,
  readonly boundingBox : Box,
  readonly centerX : number,
  readonly centerY : number
}
export const pushEditor = (name : string, boundingBox : Box, centerX : number, centerY : number) : PushEditorAction => ({
  type: 'push-editor',
  name,
  boundingBox,
  centerX,
  centerY
});

export type PopEditorAction = {
  readonly type : 'pop-editor'
}
export const popEditor = () : PopEditorAction => ({
  type: 'pop-editor'
});

export type ClearHistoryAction = {
  readonly type : 'clear-history'
}
export const clearHistory = () : ClearHistoryAction => ({
  type: 'clear-history'
});

export type PanZoomAction = {
  readonly type : 'panZoom',
  readonly tileToViewport : (...pos : number[]) => [number, number],
  readonly viewportToTileFloored : (...pos : number[]) => [number, number],
  readonly transform : {x : number, y : number, s : number}
}
export const panZoom = (
  tileToViewport : (...pos : number[]) => [number, number],
  viewportToTileFloored : (...pos : number[]) => [number, number],
  transform : {x : number, y : number, s : number}
) : PanZoomAction => ({
  type: 'panZoom',
  tileToViewport,
  viewportToTileFloored,
  transform
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
  readonly tile : Tool | 'empty',
  readonly tx : number,
  readonly ty : number
}
export const showContextMenu = (tile : Tool | 'empty', tx : number, ty : number) :ShowContextMenuAction => ({
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
  cancelAction() : void,
  isValid : boolean
}
export const showOkCancelMenu = (okAction : () => void, cancelAction : () => void, isValid = true) : ShowOkCancelMenuAction => ({
  type: 'showOkCancelMenu',
  okAction,
  cancelAction,
  isValid
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
export const insertComponent = (component : CompiledComponent, position : {x : number, y : number}) : InsertComponentAction => ({
  type: 'insert-component',
  component,
  position
});

export type InsertItemAction = {
  readonly type : 'insert-item',
  readonly item : Item,
  readonly position : {
    readonly x : number,
    readonly y : number
  }
}
export const insertItem = (item : Item, position : {x : number, y : number}) : InsertItemAction => ({
  type: 'insert-item',
  item,
  position
});

export const selectComponent = (component : CompiledComponent, position : {x : number, y : number}) =>  (dispatch : Dispatch<State>) => {
  dispatch(selectItem(
    drawComponent(createForest(), position.x|0, position.y|0, component),
    {
      top : (position.y|0) - (component.height>>1),
      left: (position.x|0) - (component.width>>1),
      width: component.width|0,
      height: component.height|0
    }
  ));
};

export type SelectItemAction = {
  readonly type : 'selectItem',
  readonly forest : Forest,
  readonly area : Area
}
export const selectItem = (forest : Forest, area : Area) : SelectItemAction => ({
  type: 'selectItem',
  forest,
  area
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
  readonly type : 'stopSelection'
}
export const stopSelection = () : StopSelectionAction => ({
  type: 'stopSelection'
});

export type SetTickIntervalAction = {
  readonly type : 'setTickInterval',
  readonly tickInterval : number
}
export const setTickInterval = (tickInterval: number) : SetTickIntervalAction => ({
  type: 'setTickInterval',
  tickInterval
});

export type SimulationTickAction = {
  readonly type : 'simulationTick',
  readonly tickCount : number
}
export const simulationTick = (tickCount: number) : SimulationTickAction => ({
  type: 'simulationTick',
  tickCount
});


export type ContextMenuActions =
  LoadContextMenuAction |
  AbortLoadContextMenuAction |
  ShowContextMenuAction |
  HideContextMenuAction;

export type EditorActions =
  SetSelectedToolAction |
  SetToolDirectionAction |
  SetForestAction |
  PushEditorAction |
  PopEditorAction |
  ClearHistoryAction;

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
  InsertComponentAction |
  InsertItemAction;

export type SelectionActions =
  SelectItemAction |
  MoveSelectionAction |
  StopSelectionAction;

export type ViewActions =
  PanZoomAction |
  ResizeAction;

export type SimulationActions =
  SetTickIntervalAction |
  SimulationTickAction;

export type Action =
  ContextMenuActions |
  EditorActions |
  EditorMenuActions |
  ForestActions |
  ViewActions |
  SelectionActions |
  SimulationActions;








export const insertComponentPackage = (componentPackage : CompiledComponent) => (dispatch : Dispatch<State>, getState : () => State) => {
  const state = getState();
  if(state.selection.selection){
    dispatch(stopSelection());
    dispatch(resetEditorMenu());
  }

  const tile = state.view.viewportToTileFloored(state.view.pixelWidth/2, state.view.pixelHeight/2);
  const centerTile = {
    x: tile[0],
    y: tile[1]
  };
  const top = centerTile.y - (componentPackage.height>>1);
  const left = centerTile.x - (componentPackage.width>>1);
  const right = centerTile.x - (componentPackage.width>>1) + componentPackage.width;
  const bottom = centerTile.y - (componentPackage.height>>1) + componentPackage.height;

  const isValid = isEmpty(state.forest.enneaTree, top, left, right, bottom);
  dispatch(showOkCancelMenu(
    () => {
      const selection = getState().selection;
      if(selection.selection == false) return;
      dispatch(insertComponent(componentPackage, {
        x: selection.x + selection.dx,
        y: selection.y + selection.dy
      }));
      dispatch(save());
      dispatch(stopSelection());
      dispatch(resetEditorMenu());
    },
    () => {
      dispatch(stopSelection());
      dispatch(resetEditorMenu());
    },
    isValid
  ));
  dispatch(selectComponent(componentPackage, centerTile));
}

export const insertComponentPackages = (componentPackage : CompiledComponent, positions : IterableIterator<{x : number, y : number}>) => (dispatch : Dispatch<State>, getState : () => State) => {
  const state = getState();
  if(state.selection.selection){
    dispatch(stopSelection());
    dispatch(resetEditorMenu());
  }

  const insertIntoNextPosition = (position : IteratorResult<{x : number, y : number}>) => {
    if(position.done) {
      dispatch(save());
      return;
    }

    dispatch(showOkCancelMenu(
      () => {
        const selection = getState().selection;
        if(selection.selection == false) return;
        dispatch(insertComponent(componentPackage, {
          x: selection.x + selection.dx,
          y: selection.y + selection.dy
        }));
        dispatch(stopSelection());
        dispatch(resetEditorMenu());
        insertIntoNextPosition(positions.next());
      },
      () => {
        dispatch(stopSelection());
        dispatch(resetEditorMenu());
        insertIntoNextPosition(positions.next());
      },
      false
    ));

    dispatch(removeTileAt(position.value.x, position.value.y))
    dispatch(selectComponent(componentPackage, position.value));
  };

  insertIntoNextPosition(positions.next());
}

export const hideContextMenuAfter = (action : ThunkAction<any, State, any>) => (dispatch : Dispatch<State>) => {
  dispatch(resetEditorMenu());
  dispatch(action);
  dispatch(hideContextMenu());
};

export const loadForest = (name : string, keepHistory = true) => async (dispatch : Dispatch<State>) => {
  const component = await storage.load(name);
  const boundingBox = getComponentBoundingBox(component.enneaTree);
  if(keepHistory){
    dispatch(clearHistory());
  }
  dispatch(setForest(name, component, boundingBox));
};

export const moveItemAt = (tx : number, ty : number) => (dispatch : Dispatch<State>, getState : () => State) => {
  const state = getState();
  const item = getTileAt(state.forest.enneaTree, ty, tx);
  dispatch(removeTileAt(tx, ty));
  dispatch(selectItem(copyTo(createForest(), item.data, item.left, item.top), item));
  dispatch(showOkCancelMenu(
    () => {
      const selection = getState().selection;
      if(selection.selection == false) return;
      dispatch(insertItem(item.data, {
        x: selection.x + selection.dx,
        y: selection.y + selection.dy
      }));
      dispatch(save());
      dispatch(stopSelection());
      dispatch(resetEditorMenu());
    },
    () => {
      dispatch(setForest(state.editor.currentComponentName, state.forest, state.editor.boundingBox));
      dispatch(stopSelection());
      dispatch(resetEditorMenu());
    },
    true
  ));
};

export const save = () => async (dispatch : Dispatch<State>, getState : () => State) => {
  const {forest, editor : {currentComponentName}} = getState();
  await storage.save(currentComponentName, forest);
};

export const saveAfter = (action : Action) => async (dispatch : Dispatch<State>, getState : () => State) => {
  dispatch(action);
  const {forest, editor : {currentComponentName}} = getState();
  await storage.save(currentComponentName, forest);
};