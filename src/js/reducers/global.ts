import {
  GlobalActions
} from '../actions';

import Perspective from '../Perspective';

export interface GlobalState {
  readonly viewportToTileFloored : (...pos : number[]) => [number, number]
}

export default function global(state : GlobalState = {
  viewportToTileFloored: () => [0,0]
}, action : GlobalActions) : GlobalState {
  switch(action.type){
    case 'panZoom':
      return {
        viewportToTileFloored: action.viewportToTileFloored
      }
    default:
      return state;
  }
}
