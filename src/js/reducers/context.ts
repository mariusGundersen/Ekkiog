import { Tool, Direction, Box, Forest, createForest } from 'ekkiog-editing';

import forest from './forest';
import getComponentBoundingBox from '../utils/getComponentBoundingBox';
import {
  Action
} from '../actions';

export interface ContextState {
  readonly name : string
  readonly previous? : PushedContextState
  readonly forest : Forest
  readonly boundingBox : Box
}

export interface PushedContextState extends ContextState {
  readonly centerX : number
  readonly centerY : number
}

const initialState : ContextState = {
  name: 'empty',
  forest: createForest(),
  boundingBox: {top: 56, left: 56, right: 72, bottom: 72}
};

export default function context(state = initialState, action: Action) : ContextState {
  switch(action.type){
    case 'new-context':
      return {
        name: action.name,
        forest: action.forest,
        boundingBox: getComponentBoundingBox(action.forest.enneaTree)
      };
    case 'push-context':
      return {
        name: action.name,
        forest: action.forest,
        boundingBox: getComponentBoundingBox(action.forest.enneaTree),
        previous: {
          ...state,
          boundingBox: action.boundingBox,
          centerX: action.centerX,
          centerY: action.centerY
        }
      };
    case 'pop-context':
      return state.previous || initialState;
    default:
      return combine(state, action, state.forest, forest);
  }
}

function combine(
  state : ContextState,
  action : Action,
  current : Forest,
  reducer : (forest : Forest, action : Action) => Forest)
   : ContextState {
  const next = reducer(current, action);
  return next === current ? state : {...state, forest: next};
}