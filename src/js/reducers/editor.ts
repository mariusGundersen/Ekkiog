import { Tool, Direction } from 'ekkiog-editing';

import {
  EditorActions
} from '../actions';

export interface EditorState {
  readonly toolDirection : Direction,
  readonly selectedTool : Tool,
  readonly currentComponentName : string
}

export default function editor(state : EditorState = {
  toolDirection: 'rightwards',
  selectedTool: 'wire',
  currentComponentName: 'empty',
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
    default:
      return state;
  }
}
