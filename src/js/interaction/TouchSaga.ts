import { EventEmitter } from 'events';
import EventSaga from 'event-saga';

import {
  TOUCH_START,
  TOUCH_MOVE,
  TOUCH_END,
  POINTER_DOWN,
  POINTER_MOVE,
  POINTER_UP,
  CANCEL_PAN_ZOOM,
  POINTER_TAP,
  LONG_PRESS,
  POTENTIAL_LONG_PRESS,
  POTENTIAL_LONG_PRESS_CANCEL
} from '../events';

import {
  Pos,
  PointerDownEvent,
  PointerMoveEvent,
  PointerUpEvent,
  CancelPanZoomEvent
} from './types';

const TAP_TOO_SLOW_TIMEOUT = 'tapTooSlowTimeout';
const LONG_PRESS_TIMEOUT = 'longPressTimeout';

const MAX_UNMOVED_DISTANCE = 5;
const MAX_TAP_TIME = 100;
const MIN_LONG_TOUCH_TIME = 1000;

interface TouchData {
  state : 'fresh' | 'hold' | 'move' | 'longpress'
  start : Pos
}

interface TouchEvent extends Pos {
  id : number
}

export default class TouchSaga extends EventSaga<TouchData, number> {
  constructor(eventEmitter : EventEmitter){
    super(eventEmitter, saga => {
      saga.createOn<TouchEvent>(TOUCH_START, function(data){
        this.data = {
          state: 'fresh',
          start: {
            x: data.x,
            y: data.y
          }
        };

        this.emit<PointerDownEvent>(POINTER_DOWN, {
          id: this.id,
          x: data.x,
          y: data.y
        });

        this.setTimeout(TAP_TOO_SLOW_TIMEOUT, MAX_TAP_TIME);
        this.setTimeout<Pos>(LONG_PRESS_TIMEOUT, {
          x: data.x,
          y: data.y
        }, MIN_LONG_TOUCH_TIME);

      });

      saga.on<TouchEvent>(TOUCH_MOVE, function(data){
        if(this.data.state === 'fresh') return;

        this.emit<PointerMoveEvent>(POINTER_MOVE, {
          id: this.id,
          x: data.x,
          y: data.y
        });

        if(this.data.state === 'hold'){
          const moved = Math.abs(data.x - this.data.start.x) > MAX_UNMOVED_DISTANCE
                     || Math.abs(data.y - this.data.start.y) > MAX_UNMOVED_DISTANCE;
          if(moved){
            this.data.state = 'move';
            this.clearTimeout(LONG_PRESS_TIMEOUT);
            this.emit(POTENTIAL_LONG_PRESS_CANCEL, {
              id: this.id,
              x: data.x,
              y: data.y
            });
          }
        }
      });

      saga.on(TAP_TOO_SLOW_TIMEOUT, function(data){
        this.data.state = 'hold';
        this.emit(POTENTIAL_LONG_PRESS, {
          id: this.id,
          x: this.data.start.x,
          y: this.data.start.y,
          time: MIN_LONG_TOUCH_TIME - MAX_TAP_TIME
        });
      });

      saga.on<Pos>(LONG_PRESS_TIMEOUT, function(data) {
        this.data.state = 'longpress';
        this.emit(CANCEL_PAN_ZOOM, {
          id: this.id
        });

        this.emit(LONG_PRESS, {
          pointer: this.id,
          x: data.x,
          y: data.y
        });
      });

      saga.on<TouchEvent>(TOUCH_END, function(data){
        if(this.data.state === 'fresh'){
          this.emit(POINTER_TAP, {
            x: data.x,
            y: data.y
          });
        }

        if(this.data.state === 'hold'){
          this.emit(POTENTIAL_LONG_PRESS_CANCEL, {
            id: this.id,
            x: data.x,
            y: data.y
          });
        }

        this.emit<PointerUpEvent>(POINTER_UP, {
          id: this.id,
          x: data.x,
          y: data.y
        });

        this.done();
      });
    });
  }
}