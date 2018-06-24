import { TileType } from 'ekkiog-editing';

import {
  Action, LoadContextMenuAction
} from '../actions';

export interface ContextMenuHideState {
  readonly type: 'hide'
}

export interface ContextMenuLoadingState {
  readonly type: 'load'
  readonly tx: number,
  readonly ty: number
}

export interface ContextMenuShowState {
  readonly type: 'show'
  readonly tx: number,
  readonly ty: number
}

export type ContextMenuState = ContextMenuHideState | ContextMenuLoadingState | ContextMenuShowState;

const initialState: ContextMenuState = {
  type: 'hide',
};

export default function contextMenu(state = initialState, action : Action) : ContextMenuState {
  switch(action.type){
    case 'loadContextMenu':
      return state.type === 'hide' && isInside(action) ? {
        type: 'load',
        tx: action.tx,
        ty: action.ty
      } : state;
    case 'showContextMenu':
      return state.type === 'load' ? {
        ...state,
        type: 'show',
      } : state;
    case 'abortLoadContextMenu':
      return state.type === 'load' ? {
        type: 'hide'
      } : state;
    case 'hideContextMenu':
      return {
        type: 'hide'
      };
    default:
      return state;
  }
}

const isInside = ({tx, ty} : LoadContextMenuAction) => tx >= 0 && ty >= 0 && tx < 128 && ty < 128;