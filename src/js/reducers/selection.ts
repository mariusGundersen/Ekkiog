import { Forest } from 'ekkiog-editing';

import {
  Action
} from '../actions';

export interface ComponentSelectedState {
  readonly selection : true,
  readonly forest : Forest,
  readonly top : number,
  readonly left : number,
  readonly right : number,
  readonly bottom : number,
  readonly dx : number,
  readonly dy : number,
  readonly x : number,
  readonly y : number
}

export interface NothingSelectedState {
  readonly selection : false
}

export type SelectionState = ComponentSelectedState | NothingSelectedState;

export default function reduce(state : NothingSelectedState = {
  selection: false
}, action : Action) : SelectionState {
  switch(action.type){
    case 'selectItem':
      return {
        forest: action.forest,
        top: (action.area.top|0),
        left: (action.area.left|0),
        right: (action.area.left|0) + (action.area.width|0),
        bottom: (action.area.top|0) + (action.area.height|0),
        dx: 0,
        dy: 0,
        x: action.area.left|0,
        y: action.area.top|0,
        selection: true
      };
    case 'moveSelection':
      return {
        ...state,
        dx: action.dx,
        dy: action.dy
      };
    case 'stopSelection':
      return {
        selection: false
      }
    default:
      return state;
  }
}