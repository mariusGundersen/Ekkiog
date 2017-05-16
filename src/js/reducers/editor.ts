import { Tool, Direction } from 'ekkiog-editing';

import {
  EditorActions
} from '../actions';

export interface EditorState {
  readonly toolDirection : Direction,
  readonly selectedTool : Tool,
  readonly currentComponentName : string,
  readonly stack? : Link<string>
}

export interface Link<T> {
  readonly next? : Link<T>
  readonly value : T
}

export default function editor(state : EditorState = {
  toolDirection: 'rightwards',
  selectedTool: 'wire',
  currentComponentName: 'empty',
  stack: undefined
}, action : EditorActions) : EditorState{
  switch(action.type){
    case 'setSelectedTool':
      return {
        ...state,
        selectedTool: action.tool
      };
    case 'setToolDirection':
      return {
        ...state,
        toolDirection: action.direction
      };
    case 'set-forest':
      return {
        ...state,
        currentComponentName: action.name
      };
    case 'push-editor':
      return {
        ...state,
        stack: {value: action.name, next: state.stack}
      };
    case 'pop-editor':
      return {
        ...state,
        stack: state.stack ? state.stack.next : undefined
      };
    default:
      return state;
  }
}
