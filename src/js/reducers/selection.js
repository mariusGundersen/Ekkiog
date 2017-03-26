import { drawComponent, createForest } from 'ekkiog-editing';

import {
  SELECT_COMPONENT,
  MOVE_SELECTION,
  STOP_SELECTION
} from '../actions';

export default function reduce(state={
  forest: createForest(),
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  dx: 0,
  dy: 0,
  selection: false
}, action){
  switch(action.type){
    case SELECT_COMPONENT:
      return {
        forest: drawComponent(state.forest, action.position.x|0, action.position.y|0, action.component),
        top: (action.position.y|0) - (action.component.height>>1),
        left: (action.position.x|0) - (action.component.width>>1),
        right: (action.position.x|0) - (action.component.width>>1) + action.component.width,
        bottom: (action.position.y|0) - (action.component.height>>1) + action.component.height,
        dx: 0,
        dy: 0,
        selection: true
      };
    case MOVE_SELECTION:
      return {
        ...state,
        dx: action.dx,
        dy: action.dy
      };
    case STOP_SELECTION:
      return {
        ...state,
        forest: createForest(),
        selection: false
      }
    default:
      return state;
  }
}