import { EventEmitter } from 'events';
import EventSaga from 'event-saga';

import {
  POINTER_TAP,
  POINTER_DOUBLE_TAP
} from '../events';

import {
  Pos
} from './types';

const DOUBLE_TAP_TOO_SLOW_TIMEOUT = 'tapTooSlowTimeout';

const MAX_UNMOVED_DISTANCE = 50;
const MAX_HOLD_TIME = 500;

interface DoubleTapData extends Pos {
  doubleTap : boolean
}

export default class TouchSaga {
  constructor(eventEmitter : EventEmitter){
    let data = {
      x: 0,
      y: 0,
      now: window.performance.now()
    };

    eventEmitter.on(POINTER_TAP, function(event : Pos) {
      const now = window.performance.now();
      if(now - data.now < MAX_HOLD_TIME
        && Math.abs(data.x - event.x) < MAX_UNMOVED_DISTANCE
        && Math.abs(data.y - event.y) < MAX_UNMOVED_DISTANCE){
          eventEmitter.emit(POINTER_DOUBLE_TAP, {x: event.x, y: event.y});
      }

      data.now = now;
      data.x = event.x;
      data.y = event.y;
    });
  }
}