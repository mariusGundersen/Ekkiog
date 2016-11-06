import { vec2 } from 'gl-matrix';

import {
  LOAD_CONTEXT_MENU,
  SHOW_CONTEXT_MENU,
  ABORT_LOAD_CONTEXT_MENU,
  PAN_ZOOM,
  HIDE_CONTEXT_MENU
} from '../actions.js';

export default function contextMenu(state={
  loading: false,
  show: false,
  x: 0,
  y: 0,
  tx: 0,
  ty: 0
}, action){
  switch(action.type){
    case LOAD_CONTEXT_MENU:
      return state.show == false ? {
        ...state,
        x: action.x,
        y: action.y,
        loading: true,
        show: false,
      } : state;
    case SHOW_CONTEXT_MENU:
      return {
        ...state,
        loading: false,
        show: true,
        tile: action.tile,
        tx: action.tx,
        ty: action.ty
      };
    case ABORT_LOAD_CONTEXT_MENU:
      return state.loading ? {
        ...state,
        loading: false,
        show: false
      } : state;
    case PAN_ZOOM:
      return (state.loading || state.show) ? {
          ...state,
          ...transform(action.matrix, state.tx, state.ty)
        } : state;
    case HIDE_CONTEXT_MENU:
      return {
        loading: false,
        show: false,
        x: 0,
        y: 0
      };
    default:
      return state;
  }
}

function transform(matrix, ...pos){
  vec2.transformMat3(pos, pos, matrix);
  return {
    x: pos[0]/window.devicePixelRatio,
    y: pos[1]/window.devicePixelRatio
  };
}