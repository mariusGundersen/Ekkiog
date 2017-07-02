import { drawComponent, createForest, Forest } from 'ekkiog-editing';

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
    case 'selectComponent':
      return {
        forest: drawComponent(createForest(), action.position.x|0, action.position.y|0, action.component),
        top: (action.position.y|0) - (action.component.height>>1),
        left: (action.position.x|0) - (action.component.width>>1),
        right: (action.position.x|0) - (action.component.width>>1) + action.component.width,
        bottom: (action.position.y|0) - (action.component.height>>1) + action.component.height,
        dx: 0,
        dy: 0,
        x: action.position.x|0,
        y: action.position.y|0,
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