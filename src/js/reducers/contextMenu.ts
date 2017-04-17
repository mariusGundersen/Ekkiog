import { vec2, mat3 } from 'gl-matrix';

import {
  ContextMenuActions
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
  readonly tile : string,
  readonly x : number,
  readonly y : number,
  readonly tx : number,
  readonly ty : number
}

export type ContextMenuState = ContextMenuHideState | ContextMenuLoadingState | ContextMenuShowState;

export default function contextMenu(state : ContextMenuState = {
  loading: false,
  show: false,
  x: 0,
  y: 0,
  tx: 0,
  ty: 0
}, action : ContextMenuActions) : ContextMenuState {
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
    case 'panZoom':
      return state.show ? {
          ...state,
          ...transform(action.tileToViewportMatrix, state.tx, state.ty)
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

function transform(matrix : mat3, ...pos : number[]){
  vec2.transformMat3(pos as any, pos, matrix);
  return {
    x: pos[0]/window.devicePixelRatio,
    y: pos[1]/window.devicePixelRatio
  };
}