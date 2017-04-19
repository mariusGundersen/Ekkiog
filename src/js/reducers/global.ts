import { EventEmitter } from 'events';

import {
  GlobalActions
} from '../actions';

import Context from '../Context';
import Renderer from '../engines/Renderer';
import Perspective from '../Perspective';
import { VertexBuffer, RenderContext, AtomicBind } from '../textures/types';

interface GlobalSharedState {
  readonly emitter : EventEmitter,
  readonly perspective : Perspective
}

export interface GlobalStateInitialized extends GlobalSharedState {
  readonly initialized : true,
  readonly gl : WebGLRenderingContext
  readonly renderer : Renderer,
  readonly context : Context,
  readonly selectionContext : Context,
  readonly emitter : EventEmitter,
  readonly perspective : Perspective
}

export interface GlobalStateUninitialized extends GlobalSharedState {
  readonly initialized : false
}

export type GlobalState = GlobalStateUninitialized | GlobalStateInitialized;

export default function global(state : GlobalState = {
  initialized: false,
  emitter: new EventEmitter(),
  perspective: new Perspective()
}, action : GlobalActions) : GlobalState {
  switch(action.type){
    case 'gl':
      if(state.initialized) return state;
      const atomicBind = makeAtomicBind();
      return {
        ...state,
        initialized: true,
        gl: action.gl,
        renderer: new Renderer(action.gl),
        context: new Context(action.gl, atomicBind),
        selectionContext: new Context(action.gl, atomicBind)
      };
    case 'set-forest':
      state.perspective.reset();
      return state;
    default:
      return state;
  }
}

function makeAtomicBind(){
  let currentVBO : VertexBuffer | undefined = undefined;
  return (vbo : VertexBuffer) => {
    if(currentVBO === vbo) return;

    currentVBO = vbo;
    vbo.bind();
  };
}