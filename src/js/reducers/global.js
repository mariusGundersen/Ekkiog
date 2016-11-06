import {EventEmitter} from 'events';

import {
  GL
} from '../actions.js';

import Context from '../Context.js';
import Renderer from '../engines/Renderer.js';
import Perspective from '../Perspective.js';

export default function global(state={
  gl: null
}, action){
  switch(action.type){
    case GL:
      return {
        gl: action.gl,
        renderer: new Renderer(action.gl),
        context: new Context(action.gl),
        emitter: new EventEmitter(),
        perspective: new Perspective()
      };
    default:
      return state;
  }
}
