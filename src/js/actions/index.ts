import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { State } from '../reduce';
import { ContextActions, saveForest } from './context';
import { ContextMenuActions, hideContextMenu } from './contextMenu';
import { EditorActions } from './editor';
import { EditorMenuActions, resetEditorMenu } from './editorMenu';
import { ForestActions } from './forest';
import { SelectionActions } from './selection';
import { SimulationActions } from './simulation';
import { ViewActions } from './view';
import { PopupActions } from './popup';
import { GitPopupActions } from '../features/gitPopup/actions';
import { SyncActions } from '../features/sync/actions';
import { NameActions } from '../features/name/actions';

export * from './context';
export * from './contextMenu';
export * from './editor';
export * from './editorMenu';
export * from './forest';
export * from './popup';
export * from './router';
export * from './view';
export * from './selection';
export * from './simulation';
export * from '../features/gitPopup/actions'
export * from '../features/sync/actions';
export * from '../features/name/actions';

export type Action =
  ContextActions |
  ContextMenuActions |
  EditorActions |
  EditorMenuActions |
  ForestActions |
  PopupActions |
  ViewActions |
  SelectionActions |
  SimulationActions |
  GitPopupActions |
  SyncActions |
  NameActions;

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
