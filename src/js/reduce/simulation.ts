import { vec2, mat3 } from 'gl-matrix';

import {
  Action
} from '../actions';
import ease, { Ease, noEase, Easing, easeOut } from '../utils/ease';

export interface SimulationState {
  readonly tickInterval: number
  readonly step: number
  readonly show: boolean
  readonly ease: Easing
}

const initialState: SimulationState = {
  tickInterval: 2 ** 8,
  step: 0,
  show: true,
  ease: noEase()
};

export default function view(state = initialState, action: Action): SimulationState {
  switch (action.type) {
    case 'setTickInterval':
      return {
        ...state,
        tickInterval: action.tickInterval
      };
    case 'stepForward':
      return {
        ...state,
        tickInterval: Infinity,
        step: state.step + 1
      }
    case 'toggleShow':
      return {
        ...state,
        show: action.show,
        ease: action.show
          ? ease([0], [1], easeOut, 500)
          : ease([1], [0], easeOut, 500)
      }
    default:
      return state;
  }
}