import { vec2, mat3 } from 'gl-matrix';

import {
  ViewActions
} from '../actions';

export interface ViewState {
  readonly pixelWidth : number,
  readonly pixelHeight : number,
  readonly screenWidth : number,
  readonly screenHeight : number,
  readonly centerTile : {
    readonly x : number,
    readonly y : number
  }
}

export default function view(state : ViewState = {
  pixelWidth: 100,
  pixelHeight: 100,
  screenWidth: 100,
  screenHeight: 100,
  centerTile: {x: 64, y: 64}
}, action : ViewActions) : ViewState {
  switch(action.type){
    case 'resize':
      return {
        ...state,
        pixelWidth: action.pixelWidth,
        pixelHeight: action.pixelHeight,
        screenWidth: action.screenWidth,
        screenHeight: action.screenHeight
      };
    case 'panZoom':
      return {
        ...state,
        centerTile: transform(action.viewportToTileMatrix, state.pixelWidth/2, state.pixelHeight/2)
      };
    default:
      return state;
  }
}

function transform(matrix : mat3, ...pos : number[]){
  vec2.transformMat3(pos as any, pos, matrix);
  return {
    x: pos[0],
    y: pos[1]
  };
}