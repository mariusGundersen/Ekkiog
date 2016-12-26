import {
  TOGGLE_SEARCH
} from '../actions.js';

export default function search(state = {
  show: false
}, action){
  switch(action.type){
    case TOGGLE_SEARCH:
      return {
        ...state,
        show: !state.show
      };
    default:
      return state;
  }
}