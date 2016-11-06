import {
  RESIZE
} from '../actions.js';

export default function view(state={
  pixelWidth: 100,
  pixelHeight: 100,
  screenWidth: 100,
  screenHeight: 100
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
    default:
      return state;
  }
}