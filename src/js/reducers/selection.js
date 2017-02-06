import createForest from '../editing/actions/createForest.ts';

import {
  SELECT_COMPONENT,
  MOVE_SELECTION,
  STOP_SELECTION
} from '../actions.js';

import drawComponent from '../editing/actions/drawComponent.ts';

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
        forest: drawComponent(state.forest, action.position.x|0, action.position.y|0, action.component.source),
        top: (action.position.y|0) - (action.component.source.height>>1),
        left: (action.position.x|0) - (action.component.source.width>>1),
        right: (action.position.x|0) - (action.component.source.width>>1) + action.component.source.width,
        bottom: (action.position.y|0) - (action.component.source.height>>1) + action.component.source.height,
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