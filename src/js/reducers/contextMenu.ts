import { vec2, mat3 } from 'gl-matrix';

import { TileType } from 'ekkiog-editing';

import {
  Action
} from '../actions';

export interface ContextMenuHideState {
  readonly loading : false,
  readonly show : false
}

export interface ContextMenuLoadingState {
  readonly loading : true,
  readonly show : false,
  readonly x : number,
  readonly y : number
}

export interface ContextMenuShowState {
  readonly loading : false,
  readonly show : true,
  readonly tile : TileType,
  readonly tx : number,
  readonly ty : number
}

export type ContextMenuState = ContextMenuHideState | ContextMenuLoadingState | ContextMenuShowState;

export default function contextMenu(state : ContextMenuState = {
  loading: false,
  show: false,
}, action : Action) : ContextMenuState {
  switch(action.type){
    case 'loadContextMenu':
      return state.show == false ? {
        x: action.x,
        y: action.y,
        loading: true,
        show: false,
      } : state;
    case 'showContextMenu':
      return state.loading ? {
        ...state,
        loading: false,
        show: true,
        tile: action.tile,
        tx: action.tx,
        ty: action.ty
      } : state;
    case 'abortLoadContextMenu':
      return state.loading ? {
        ...state,
        loading: false,
        show: false
      } : state;
    case 'hideContextMenu':
      return {
        loading: false,
        show: false
      };
    default:
      return state;
  }
}