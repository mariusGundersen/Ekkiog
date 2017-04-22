import { vec2, mat3 } from 'gl-matrix';

import {
  ViewActions
} from '../actions';

export interface ViewState {
  readonly pixelWidth : number,
  readonly pixelHeight : number,
}

export default function view(state : ViewState = {
  pixelWidth: 100,
  pixelHeight: 100
}, action : ViewActions) : ViewState {
  switch(action.type){
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