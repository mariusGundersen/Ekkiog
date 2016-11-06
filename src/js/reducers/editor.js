import {
  SET_SELECTED_TOOL,
} from '../actions.js';

export default function editor(state={
  selectedTool: 'wire'
}, action){
  switch(action.type){
    case SET_SELECTED_TOOL:
      return {
        ...state,
        selectedTool: action.tool
      };
    default:
      return state;
  }
}
