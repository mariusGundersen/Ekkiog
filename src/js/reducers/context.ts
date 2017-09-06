import { Tool, Direction, Box, Forest, createForest } from 'ekkiog-editing';

import forest from './forest';
import getComponentBoundingBox from '../utils/getComponentBoundingBox';
import {
  Action
} from '../actions';

export interface ContextState {
  readonly name : string
  readonly previous? : ParentContextState
  readonly forest : Forest
  readonly boundingBox : Box
  readonly undoStack? : Link<Forest>
  readonly redoStack? : Link<Forest>
}

export interface ParentContextState extends ContextState {
  readonly centerX : number
  readonly centerY : number
}

export interface Link<T> {
  readonly next? : Link<T>
  readonly value : T
  readonly count : number
}

export default function context(state : ContextState | null, action: Action) : ContextState | null {
  if(action.type === 'new-context'){
    return {
      name: action.name,
      forest: action.forest,
      boundingBox: getComponentBoundingBox(action.forest.enneaTree)
    }
  }else if(state == undefined){
    return null;
  }else{
    switch(action.type){
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
        return state.previous || state;
      case 'undo-context':
        return !state.undoStack ? state : {
          ...state,
          forest: state.undoStack.value,
          undoStack: state.undoStack.next,
          redoStack: {
            value: state.forest,
            next: state.redoStack,
            count: state.redoStack ? state.redoStack.count+1 : 1
          }
        };
      case 'redo-context':
        return !state.redoStack ? state : {
          ...state,
          forest: state.redoStack.value,
          redoStack: state.redoStack.next,
          undoStack: {
            value: state.forest,
            next: state.undoStack,
            count: state.undoStack ? state.undoStack.count+1 : 1
          }
        };
      default:
        return combine(state, action, state.forest, forest);
    }
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
    redoStack: undefined,
    undoStack: {
      next: state.undoStack,
      value: current,
      count: state.undoStack ? state.undoStack.count+1 : 1
    }
  };
}