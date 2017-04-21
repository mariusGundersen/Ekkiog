import { EventEmitter } from 'events';

import {
  GlobalActions
} from '../actions';

import Engine from '../engines/Engine';
import Perspective from '../Perspective';

interface GlobalSharedState {
  readonly emitter : EventEmitter,
  readonly perspective : Perspective
}

export interface GlobalStateInitialized extends GlobalSharedState {
  readonly initialized : true
  readonly engine : Engine
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
      return {
        ...state,
        initialized: true,
        engine: new Engine(action.gl)
      };
    case 'set-forest':
      state.perspective.reset();
      return state;
    default:
      return state;
  }
}
