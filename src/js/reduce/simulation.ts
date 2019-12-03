import {
  Action
} from '../actions';
import ease, { noEase, Easing, easeOut } from '../utils/ease';

export interface SimulationState {
  readonly tickInterval: number
  readonly tick: number
  readonly sample: number
  readonly samples: number
  readonly show: boolean
  readonly ease: Easing
  readonly looping: boolean
}

const initialState: SimulationState = {
  tickInterval: 2 ** 8,
  tick: 0,
  sample: 0,
  samples: 0,
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
        sample: state.looping
          ? (state.sample + 1 > state.samples ? 0 : state.sample + 1)
          : (state.sample + 1 > state.samples ? state.samples : state.sample + 1)
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
        samples: action.forest.testScenario ? Math.max(...action.forest.testScenario.probes.map(i => i.values.replace(/\s/g, '')).map(s => s.length)) : 0,
        tick: state.tick + 1,
        show: action.forest.testScenario ? true : false,
        ease: ease([state.show ? 1 : 0], [action.forest.testScenario ? 1 : 0], easeOut, 500),
        looping: action.forest.testScenario ? true : false
      }
    case 'set-test-scenario':
      return {
        ...state,
        show: true
      }
    case 'tick':
      return {
        ...state,
        tick: state.tick + action.ticks,
        sample: state.looping
          ? (state.sample == state.samples ? 0 : state.sample + action.ticks > state.samples ? state.samples : state.sample + action.ticks)
          : (state.sample + action.ticks > state.samples ? state.samples : state.sample + action.ticks)
      }
    case 'toggle-loop':
      return {
        ...state,
        looping: !state.looping
      }
    default:
      return state;
  }
}