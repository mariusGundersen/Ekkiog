import { vec2, mat3 } from 'gl-matrix';

import {
  ViewActions
} from '../actions';

export interface ViewState {
  readonly pixelWidth : number,
  readonly pixelHeight : number,
  readonly viewportToTileFloored : (...pos : number[]) => [number, number]
}

export default function view(state : ViewState = {
  viewportToTileFloored: () => [0,0],
  pixelWidth: 100,
  pixelHeight: 100
}, action : ViewActions) : ViewState {
  switch(action.type){
    case 'panZoom':
      return {
        ...state,
        viewportToTileFloored: action.viewportToTileFloored
      }
    case 'resize':
      return {
        ...state,
        pixelWidth: action.pixelWidth,
        pixelHeight: action.pixelHeight
      };
    default:
      return state;
  }
}