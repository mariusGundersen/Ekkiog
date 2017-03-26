import {
  SET_SELECTED_TOOL,
  SET_TOOL_DIRECTION,
  SET_FOREST
} from '../actions.js';

export default function editor(state={
  toolDirection: 'right',
  selectedTool: 'wire',
  currentComponentName: 'empty',
}, action){
  switch(action.type){
    case SET_SELECTED_TOOL:
      return {
        ...state,
        selectedTool: action.tool
      };
    case SET_TOOL_DIRECTION:
      return {
        ...state,
        toolDirection: action.direction
      };
    case SET_FOREST:
      return {
        ...state,
        currentComponentName: action.name
      };
    default:
      return state;
  }
}
