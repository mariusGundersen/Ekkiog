import { EventEmitter } from 'events';

import {
  GlobalActions
} from '../actions';

import Context from '../Context';
import Renderer from '../engines/Renderer';
import Perspective from '../Perspective';
import { Storage } from '../storage/database';

export interface GlobalStateInitialized {
  readonly initialized : true,
  readonly gl : WebGLRenderingContext
  readonly database : Storage,
  readonly renderer : Renderer,
  readonly context : Context,
  readonly selectionContext : Context,
  readonly emitter : EventEmitter,
  readonly perspective : Perspective
}

export interface GlobalStateUninitialized {
  readonly initialized : false,
  readonly database : Storage,
  readonly emitter : EventEmitter,
  readonly perspective : Perspective
}

export type GlobalState = GlobalStateUninitialized | GlobalStateInitialized;

export default (database : Storage) => function global(state : GlobalState = {
  initialized: false,
  database,
  emitter: new EventEmitter(),
  perspective: new Perspective()
}, action : GlobalActions) : GlobalState {
  switch(action.type){
    case 'gl':
      return {
        ...state,
        initialized: true,
        gl: action.gl,
        renderer: new Renderer(action.gl),
        context: new Context(action.gl),
        selectionContext: new Context(action.gl)
      };
    case 'set-forest':
      state.perspective.reset();
      return state;
    default:
      return state;
  }
}
