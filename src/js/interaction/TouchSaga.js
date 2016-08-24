import EventSaga from 'event-saga';

import {
  TOUCH_START,
  TOUCH_MOVE,
  TOUCH_END,
  POINTER_DOWN,
  POINTER_MOVE,
  POINTER_UP,
  TAP,
  LONG_PRESS,
  POTENTIAL_LONG_PRESS,
  POTENTIAL_LONG_PRESS_CANCEL
} from '../events.js';

const TAP_TOO_SLOW_TIMEOUT = 'tapTooSlowTimeout';
const LONG_PRESS_TIMEOUT = 'longPressTimeout';

const MAX_UNMOVED_DISTANCE = 5;
const MAX_TAP_TIME = 100;
const MIN_LONG_TOUCH_TIME = 1000;

export default class TouchSaga extends EventSaga {
  constructor(eventEmitter){
    super(eventEmitter, saga => {
      saga.createOn(TOUCH_START, function(data){
        this.data = {
          moved: false,
          maybeTap: true,
          longPress: false,
          start: {
            x: data.x,
            y: data.y
          },
          x: data.x,
          y: data.y
        };

        this.emit(POINTER_DOWN, {
          pointer: this.id,
          x: data.x,
          y: data.y
        });

        this.setTimeout(TAP_TOO_SLOW_TIMEOUT, MAX_TAP_TIME);
        this.setTimeout(LONG_PRESS_TIMEOUT, {
          x: data.x,
          y: data.y
        }, MIN_LONG_TOUCH_TIME);

      });

      saga.on(TOUCH_MOVE, function(data){
        this.data.x = data.x;
        this.data.y = data.y;

        this.emit(POINTER_MOVE, {
          pointer: this.id,
          x: data.x,
          y: data.y
        });

        if(!this.data.moved){
          this.data.moved = Math.abs(data.x - this.data.start.x) > MAX_UNMOVED_DISTANCE
                        || Math.abs(data.y - this.data.start.y) > MAX_UNMOVED_DISTANCE;
          if(this.data.moved){
            this.clearTimeout(LONG_PRESS_TIMEOUT);
            if(!this.data.maybeTap && !this.data.longPress){
              this.emit(POTENTIAL_LONG_PRESS_CANCEL, {
                pointer: this.id,
                x: data.x,
                y: data.y
              });
            }
          }
        }
      });

      saga.on(TAP_TOO_SLOW_TIMEOUT, function(data){
        this.data.maybeTap = false;
        if(this.data.moved == false){
          this.emit(POTENTIAL_LONG_PRESS, {
            pointer: this.id,
            x: this.data.x,
            y: this.data.y,
            time: MIN_LONG_TOUCH_TIME - MAX_TAP_TIME
          });
        }
      });

      saga.on(LONG_PRESS_TIMEOUT, function(data) {
        this.data.longPress = true;
        this.emit(POINTER_UP, {
          pointer: this.id,
          x: data.x,
          y: data.y
        });

        this.emit(LONG_PRESS, {
          pointer: this.id,
          x: data.x,
          y: data.y
        });
      });

      saga.on(TOUCH_END, function(data){
        if(this.data.maybeTap && !this.data.moved){
          this.emit(TAP, {
            x: data.x,
            y: data.y
          });
        }

        if(!this.data.maybeTap && !this.data.longPress){
          this.emit(POTENTIAL_LONG_PRESS_CANCEL, {
            pointer: this.id,
            x: data.x,
            y: data.y
          });
        }

        this.emit(POINTER_UP, {
          pointer: this.id,
          x: data.x,
          y: data.y
        });

        this.done();
      });
    });
  }
}