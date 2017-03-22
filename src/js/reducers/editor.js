import {
  SET_SELECTED_TOOL,
  SET_FOREST
} from '../actions.js';

export default function editor(state={
  selectedTool: 'wire',
  currentComponentName: 'empty',
}, action){
  switch(action.type){
    case SET_SELECTED_TOOL:
      return {
        ...state,
        selectedTool: action.tool
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
