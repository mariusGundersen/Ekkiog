import { Tool, Direction, Box } from 'ekkiog-editing';

import {
  Action
} from '../actions';

export interface EditorState {
  readonly toolDirection : Direction,
  readonly selectedTool : Tool,
  readonly currentComponentName : string,
  readonly history? : Link<HistoryEntry>,
  readonly boundingBox : Box
}

export interface Link<T> {
  readonly next? : Link<T>
  readonly value : T
}

export interface HistoryEntry {
  readonly name : string,
  readonly boundingBox : Box,
  readonly centerX : number,
  readonly centerY : number
}

export default function editor(state : EditorState = {
  toolDirection: 'rightwards',
  selectedTool: 'wire',
  currentComponentName: 'empty',
  history: undefined,
  boundingBox: {top: 56, left: 56, right: 72, bottom: 72}
}, action : Action) : EditorState{
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
        boundingBox: action.boundingBox,
        currentComponentName: action.name
      };
    case 'push-editor':
      return {
        ...state,
        history: {
          next: state.history,
          value: {
            name: action.name,
            boundingBox: action.boundingBox,
            centerX: action.centerX,
            centerY: action.centerY
          }
        }
      };
    case 'pop-editor':
      return {
        ...state,
        boundingBox: state.history ? state.history.value.boundingBox : {top: 56, left: 56, right: 72, bottom: 72},
        currentComponentName: state.history ? state.history.value.name : 'empty',
        history: state.history ? state.history.next : undefined
      };
    case 'clear-history':
      return {
        ...state,
        history: undefined
      };
    default:
      return state;
  }
}
