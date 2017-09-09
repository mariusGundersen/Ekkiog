import { vec2, mat3 } from 'gl-matrix';

import {
  ViewActions,
  Action
} from '../actions';

export interface ViewState {
  readonly pixelWidth : number,
  readonly pixelHeight : number,
  viewportToTile(...pos : number[]) : [number, number],
  tileToViewport(...pos : number[]) : [number, number]
}

const initialState : ViewState = {
  viewportToTile: () => [0,0],
  tileToViewport: () => [0, 0],
  pixelWidth: 100,
  pixelHeight: 100
};

export default function view(state = initialState, action : Action) : ViewState {
  switch(action.type){
    case 'panZoom':
      return {
        ...state,
        viewportToTile: action.viewportToTile,
        tileToViewport: action.tileToViewport
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