import { vec2 } from 'gl-matrix';

import {
  RESIZE,
  PAN_ZOOM
} from '../actions';

export default function view(state={
  pixelWidth: 100,
  pixelHeight: 100,
  screenWidth: 100,
  screenHeight: 100,
  centerTile: {x: 64, y: 64}
}, action){
  switch(action.type){
    case RESIZE:
      return {
        ...state,
        pixelWidth: action.pixelWidth,
        pixelHeight: action.pixelHeight,
        screenWidth: action.screenWidth,
        screenHeight: action.screenHeight
      };
    case PAN_ZOOM:
      return {
        ...state,
        centerTile: transform(action.inverse, state.pixelWidth/2, state.pixelHeight/2)
      };
    default:
      return state;
  }
}

function transform(matrix, ...pos){
  vec2.transformMat3(pos, pos, matrix);
  return {
    x: pos[0],
    y: pos[1]
  };
}