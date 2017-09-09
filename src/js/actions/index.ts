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
import { tap } from '../reduce/forest';
import copyTo from '../editing/copyTo';
import * as storage from '../storage';

import { ContextActions, saveForest, forestLoaded, forestSaved, newContextLoading } from './context';
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

export const hideContextMenuAfter = (action : ThunkAction<any, State, any> | Action) => (dispatch : Dispatch<State>) => {
  dispatch(resetEditorMenu());
  dispatch(action as any);
  dispatch(hideContextMenu());
};


export const saveAfter = (action : Action, mesage : string) => async (dispatch : Dispatch<State>, getState : () => State) => {
  const context = getState().context;

  const oldForest = context.forest;
  dispatch(action);
  const newForest = (getState().context as any).forest;
  if(oldForest !== newForest){
    await dispatch(saveForest(mesage));
  }
};
