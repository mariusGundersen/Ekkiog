import { vec2, mat3 } from 'gl-matrix';

import {
  Action
} from '../actions';

export interface SimulationState {
  readonly tickCount : number,
  readonly tickInterval : number
}

export default function view(state : SimulationState = {
  tickCount: 0,
  tickInterval: 2**8
}, action : Action) : SimulationState {
  switch(action.type){
    case 'setTickInterval':
      return {
        ...state,
        tickInterval: action.tickInterval
      };
    case 'simulationTick':
      return {
        ...state,
        tickCount: action.tickCount
      };
    default:
      return state;
  }
}