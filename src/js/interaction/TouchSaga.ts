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
  PointerUpEvent
} from './types';

const TAP_TOO_SLOW_TIMEOUT = 'tapTooSlowTimeout';
const LONG_PRESS_TIMEOUT = 'longPressTimeout';

const MAX_UNMOVED_DISTANCE = 5;
const MAX_TAP_TIME = 100;
const MIN_LONG_TOUCH_TIME = 1000;

interface TouchData {
  state: 'fresh' | 'hold' | 'move' | 'longpress'
  start: Pos
}

interface TouchEvent extends Pos {
  id: number
}

export default class TouchSaga extends EventSaga<TouchData, number> {
  constructor(eventEmitter: EventEmitter, viewportToTile: (x: number, y: number) => [number, number]){
    super(eventEmitter, saga => {
      saga.createOn<TouchEvent>(TOUCH_START, ({x, y}, actor) => {
        const [tx, ty] = viewportToTile(x, y);
        actor.data = {
          state: 'fresh',
          start: {
            x,
            y,
            tx,
            ty
          }
        };

        actor.emit<PointerDownEvent>(POINTER_DOWN, {
          id: actor.id,
          x,
          y,
          tx,
          ty
        });

        actor.setTimeout(TAP_TOO_SLOW_TIMEOUT, MAX_TAP_TIME);
        actor.setTimeout(LONG_PRESS_TIMEOUT, MIN_LONG_TOUCH_TIME);

      });

      saga.on<TouchEvent>(TOUCH_MOVE, ({x, y}, actor) => {
        if(actor.data.state === 'fresh') return;

        const [tx, ty] = viewportToTile(x, y);
        actor.emit<PointerMoveEvent>(POINTER_MOVE, {
          id: actor.id,
          x,
          y,
          tx,
          ty
        });

        if(actor.data.state === 'hold'){
          const moved = Math.abs(x - actor.data.start.x) > MAX_UNMOVED_DISTANCE
                     || Math.abs(y - actor.data.start.y) > MAX_UNMOVED_DISTANCE;
          if(moved){
            actor.data.state = 'move';
            actor.clearTimeout(LONG_PRESS_TIMEOUT);
            actor.emit(POTENTIAL_LONG_PRESS_CANCEL, {
              id: actor.id,
              x,
              y
            });
          }
        }
      });

      saga.on(TAP_TOO_SLOW_TIMEOUT, (_, actor) => {
        actor.data.state = 'hold';
        actor.emit(POTENTIAL_LONG_PRESS, {
          id: actor.id,
          x: actor.data.start.x,
          y: actor.data.start.y,
          tx: actor.data.start.tx,
          ty: actor.data.start.ty,
          time: MIN_LONG_TOUCH_TIME - MAX_TAP_TIME
        });
      });

      saga.on<Pos>(LONG_PRESS_TIMEOUT, (_, actor) => {
        actor.data.state = 'longpress';
        actor.emit(CANCEL_PAN_ZOOM, {
          id: actor.id
        });

        actor.emit(LONG_PRESS, {
          pointer: actor.id,
          x: actor.data.start.x,
          y: actor.data.start.y,
          tx: actor.data.start.tx,
          ty: actor.data.start.ty
        });
      });

      saga.on<TouchEvent>(TOUCH_END, ({x, y}, actor) => {
        const [tx, ty] = viewportToTile(x, y);
        if(actor.data.state === 'fresh'){
          actor.emit(POINTER_TAP, {
            x,
            y,
            tx,
            ty
          });
        }

        if(actor.data.state === 'hold'){
          actor.emit(POTENTIAL_LONG_PRESS_CANCEL, {});
        }

        actor.emit<PointerUpEvent>(POINTER_UP, {
          id: actor.id
        });

        actor.done();
      });
    });
  }
}