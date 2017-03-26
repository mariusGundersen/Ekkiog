import {EventEmitter} from 'events';

import {
  GL,
  SET_FOREST
} from '../actions';

import Context from '../Context';
import Renderer from '../engines/Renderer';
import Perspective from '../Perspective';

export default database => function global(state={
  gl: null,
  database
}, action){
  switch(action.type){
    case GL:
      return {
        ...state,
        gl: action.gl,
        renderer: new Renderer(action.gl),
        context: new Context(action.gl),
        selectionContext: new Context(action.gl),
        emitter: new EventEmitter(),
        perspective: new Perspective()
      };
    case SET_FOREST:
      state.perspective.reset();
      return state;
    default:
      return state;
  }
}
