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
  readonly done? : Link<Forest>
  readonly undone? : Link<Forest>
}

export interface PushedContextState extends ContextState {
  readonly centerX : number
  readonly centerY : number
}

export interface Link<T> {
  readonly next? : Link<T>
  readonly value : T
  readonly count : number
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
    case 'undo-context':
      return !state.done ? state : {
        ...state,
        forest: state.done.value,
        done: state.done.next,
        undone: {
          value: state.forest,
          next: state.undone,
          count: state.undone ? state.undone.count+1 : 1
        }
      };
    case 'redo-context':
      return !state.undone ? state : {
        ...state,
        forest: state.undone.value,
        undone: state.undone.next,
        done: {
          value: state.forest,
          next: state.done,
          count: state.done ? state.done.count+1 : 1
        }
      };
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

  if(next === current) {
    return state;
  }

  return {
    ...state,
    forest: next,
    undone: undefined,
    done: {
      next: state.done,
      value: current,
      count: state.done ? state.done.count+1 : 1
    }
  };
}