import { 
  isEmpty,
  drawComponent,
  createForest,
  CompiledComponent,
  Direction,
  Tool
} from 'ekkiog-editing';
import { get as getTileAt } from 'ennea-tree';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { State } from '../reduce';
import { tap } from '../reducers/forest';
import copyTo from '../editing/copyTo';
import storage from '../storage';

import { ContextActions, newContext } from './context';
import { ContextMenuActions, hideContextMenu } from './contextMenu';
import { EditorActions } from './editor';
import { EditorMenuActions, resetEditorMenu, showOkCancelMenu } from './editorMenu';
import { ForestActions, insertComponent, removeTileAt, insertItem, setForest } from './forest';
import { ViewActions } from './view';
import { SelectionActions, selectItem, stopSelection } from './selection';
import { SimulationActions} from './simulation';

export * from './context';
export * from './contextMenu';
export * from './editor';
export * from './editorMenu';
export * from './forest';
export * from './view';
export * from './selection';
export * from './simulation';

export type Action =
  ContextActions |
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

  const isValid = isEmpty(state.context.forest.enneaTree, top, left, right, bottom);
  dispatch(showOkCancelMenu(
    () => {
      const selection = getState().selection;
      if(selection.selection == false) return;
      dispatch(insertComponent(componentPackage, {
        x: selection.x + selection.dx,
        y: selection.y + selection.dy
      }));
      dispatch(save(`Inserted ${componentPackage.name}`));
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
      dispatch(save(`Updated ${componentPackage.name}`));
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

export const loadForest = (name : string) => async (dispatch : Dispatch<State>) => {
  const component = await storage.load(name);
  dispatch(newContext(name, component));
};

export const moveItemAt = (tx : number, ty : number) => (dispatch : Dispatch<State>, getState : () => State) => {
  const state = getState();
  const item = getTileAt(state.context.forest.enneaTree, ty, tx);
  dispatch(removeTileAt(tx, ty));
  dispatch(selectItem(copyTo(createForest(), item.data, item), item));
  dispatch(showOkCancelMenu(
    () => {
      const selection = getState().selection;
      if(selection.selection == false) return;
      dispatch(insertItem(item.data, {
        x: selection.x + selection.dx,
        y: selection.y + selection.dy
      }));
      dispatch(save(`Moved ${item.data.type}`));
      dispatch(stopSelection());
      dispatch(resetEditorMenu());
    },
    () => {
      dispatch(setForest(state.context.forest));
      dispatch(stopSelection());
      dispatch(resetEditorMenu());
    },
    true
  ));
};

export const save = (message : string) => async (dispatch : Dispatch<State>, getState : () => State) => {
  const {forest, name} = getState().context;
  await storage.save(name, forest, message);
};

export const saveAfter = (action : Action, mesage : string) => async (dispatch : Dispatch<State>, getState : () => State) => {
  const oldForest = getState().context.forest;
  dispatch(action);
  const newForest = getState().context.forest;
  if(oldForest !== newForest){
    await dispatch(save(mesage));
  }
};

export const insertMovableItem = (tool : Tool, direction : Direction, tx : number, ty : number) => (dispatch : Dispatch<State>, getState : () => State) => {
  const buddyTree = getState().context.forest.buddyTree;
  const forest = tap(createForest(buddyTree), tool, direction, tx, ty);
  const item = getTileAt(forest.enneaTree, ty, tx);
  dispatch(selectItem(forest, item));
  dispatch(showOkCancelMenu(
    () => {
      const selection = getState().selection;
      if(selection.selection == false) return;
      dispatch(insertItem(item.data, {
        x: selection.x + selection.dx,
        y: selection.y + selection.dy
      }));
      dispatch(save(`Inserted ${tool}`));
      dispatch(stopSelection());
      dispatch(resetEditorMenu());
    },
    () => {
      dispatch(stopSelection());
      dispatch(resetEditorMenu());
    },
    false
  ));
};


export const selectComponent = (component : CompiledComponent, position : {x : number, y : number}) => (dispatch : Dispatch<State>, getState : () => State) => {
  const buddyTree = getState().context.forest.buddyTree;
  dispatch(selectItem(
    drawComponent(createForest(buddyTree), position.x|0, position.y|0, component),
    {
      top : (position.y|0) - (component.height>>1),
      left: (position.x|0) - (component.width>>1),
      width: component.width|0,
      height: component.height|0
    }
  ));
}