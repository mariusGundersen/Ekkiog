import { Tool, Direction, Box } from 'ekkiog-editing';

import {
  Action
} from '../actions';

export interface EditorState {
  readonly toolDirection : Direction,
  readonly selectedTool : Tool
}


const initialState : EditorState = {
  toolDirection: 'rightwards',
  selectedTool: 'wire'
};

export default function editor(state = initialState, action : Action) : EditorState{
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
    default:
      return state;
  }
}
