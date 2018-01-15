import { Tool, Direction, Box, Forest, createForest } from 'ekkiog-editing';

import forest from './forest';
import getComponentBoundingBox from '../utils/getComponentBoundingBox';
import {
  Action
} from '../actions';
import ease, { noEase, Easing, easeOut, easeIn } from '../utils/ease';
import { createButtonTree, ButtonNode, toggleButton } from './buttonTree';

export interface ContextState {
  readonly repo : string
  readonly name : string
  readonly version : string
  readonly hash : string
  readonly previous? : ParentContextState
  readonly forest : Forest
  readonly buttonTree : ButtonNode
  readonly boundingBox : Box
  readonly undoStack? : Link<Forest>
  readonly redoStack? : Link<Forest>
  readonly loading? : LoadingState
  readonly saving : boolean
  readonly ease : Easing
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

export interface LoadingState {
  readonly repo : string
  readonly name : string
  readonly version : string
  readonly scaleInFrom : number
  readonly abort : ContextState
}

const initialContext : ContextState = {
  repo: '',
  name: 'WELCOME',
  version: '0',
  hash: '0000000000000000000000000000000000000000',
  forest: createForest(),
  buttonTree: createButtonTree(256*256),
  boundingBox: {
    top: 56,
    left: 56,
    right: 72,
    bottom: 72
  },
  ease: noEase(boxToArray({
    top: 56,
    left: 56,
    right: 72,
    bottom: 72
  })),
  saving: false
}

export default function context(state = initialContext, action: Action) : ContextState {
  switch(action.type){
    case 'new-context-loading':
      return {
        ...state,
        previous: undefined,
        undoStack: undefined,
        redoStack: undefined,
        loading: {
          repo: action.repo,
          name: action.name,
          version: action.version,
          scaleInFrom: 1,
          abort: state
        },
        ease: state.ease
      };
    case 'forest-loaded':
      const boundingBox = getComponentBoundingBox(action.forest.enneaTree);
      return state.loading ? {
        ...state,
        repo: state.loading.repo,
        name: state.loading.name,
        version: state.loading.version,
        forest: action.forest,
        buttonTree: createButtonTree(256*256),
        hash: action.hash,
        boundingBox,
        ease: ease(boxToArray(scaleBox(boundingBox, state.loading.scaleInFrom)), boxToArray(boundingBox), easeOut, 200),
        loading: undefined
      } : state;
    case 'push-context-loading':
      return {
        ...state,
        ease: ease(boxToArray(action.boundingBox), boxToArray(scaleBox(action.boundingBox, 0.7, action.centerX, action.centerY)), easeIn, 200),
        undoStack: undefined,
        redoStack: undefined,
        previous: {
          ...state,
          boundingBox: action.boundingBox,
          centerX: action.centerX,
          centerY: action.centerY,
          ease: ease(boxToArray(scaleBox(action.boundingBox, 0.7, action.centerX, action.centerY)), boxToArray(action.boundingBox), easeOut, 200)
        },
        loading: {
          repo: action.repo,
          name: action.name,
          version: action.version,
          scaleInFrom: 1.4,
          abort: state
        }
      };
    case 'abort-context-loading':
      return state.loading
        ? state.loading.abort
        : state;
    case 'forest-saving':
      return {
        ...state,
        saving: true
      };
    case 'forest-saved':
      return {
        ...state,
        repo: '',
        saving: false
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
    case 'toggle-button':
      return {
        ...state,
        buttonTree: toggleButton(state.buttonTree, action.net)
      }
    default:
      return combine(state, action, forest);
  }
}

function combine(
  state : ContextState,
  action : Action,
  reducer : (forest : Forest, action : Action) => Forest)
   : ContextState {
  const next = reducer(state.forest, action);

  if(next === state.forest) {
    return state;
  }

  return {
    ...state,
    forest: next,
    redoStack: undefined,
    undoStack: {
      next: state.undoStack,
      value: state.forest,
      count: state.undoStack ? state.undoStack.count+1 : 1
    }
  };
}

function boxToArray({top, left, right, bottom} : Box){
  return [top, left, right, bottom];
}

function arrayToBox([top, left, right, bottom] : number[]){
  return {top, left, right, bottom};
}

function scaleBox({top, left, right, bottom} : Box, scale : number, x = (left+right)/2, y = ((top+bottom)/2)){
  const halfWidth = (right - left)/2;
  const halfHeight = (bottom - top)/2;
  const scaleX = halfHeight <= halfWidth ? scale : halfWidth/halfHeight*scale;
  const scaleY = halfHeight >= halfWidth ? scale : halfHeight/halfWidth*scale;
  return {
    top: y - halfHeight**scaleY,
    left: x - halfWidth**scaleX,
    right: x + halfWidth**scaleX,
    bottom: y + halfHeight**scaleY
  };
}