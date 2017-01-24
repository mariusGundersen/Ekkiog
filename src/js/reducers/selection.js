import createForest from '../editing/actions/createForest.js';

import {
  SELECT_COMPONENT
} from '../actions.js';

import drawComponent from '../editing/actions/drawComponent.js';

export default function reduce(state={
  forest: createForest(),
  x: 0,
  y: 0,
  selection: false
}, action){
  switch(action.type){
    case SELECT_COMPONENT:
      return {
        forest: drawComponent(state.forest, action.position.x|0, action.position.y|0, action.component.source),
        x: action.position.x|0,
        y: action.position.y|0,
        selection: true
      };
    default:
      return state;
  }
}