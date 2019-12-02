import { vec2, mat3 } from 'gl-matrix';

import {
  Action
} from '../actions';
import ease, { Ease, noEase, Easing, easeOut } from '../utils/ease';

export interface SimulationState {
  readonly tickInterval: number
  readonly tick: number
  readonly sample: number
  readonly show: boolean
  readonly ease: Easing
  readonly looping: boolean
}

const initialState: SimulationState = {
  tickInterval: 2 ** 8,
  tick: 0,
  sample: 0,
  show: false,
  ease: noEase(),
  looping: false
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
        tick: state.tick + 1,
        sample: state.sample + 1
      }
    case 'toggleShow':
      return {
        ...state,
        show: action.show,
        ease: action.show
          ? ease([0], [1], easeOut, 500)
          : ease([1], [0], easeOut, 500)
      }
    case 'pop-context':
    case 'rewind':
      return {
        ...state,
        sample: 0,
        tick: state.tick + 1
      }
    case 'forest-loaded':
      return {
        ...state,
        sample: 0,
        tick: state.tick + 1,
        show: action.forest.testScenario ? true : false,
        ease: ease([state.show ? 1 : 0], [action.forest.testScenario ? 1 : 0], easeOut, 500),
        looping: action.forest.testScenario ? true : false
      }
    case 'tick':
      return {
        ...state,
        tick: state.tick + action.ticks,
        sample: state.sample + action.ticks
      }
    case 'toggle-loop':
      return {
        ...state,
        looping: !state.looping,
        sample: 0,
        tick: state.tick + 1
      }
    default:
      return state;
  }
}