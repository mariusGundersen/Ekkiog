import { EventEmitter } from 'events';
import EventSaga from 'event-saga';

import {
  TOUCH_START,
  TOUCH_MOVE,
  TOUCH_END,
  POINTER_DOWN,
  POINTER_MOVE,
  POINTER_UP,
  POINTER_TAP
} from '../events';

import {
  Pos,
  PointerDownEvent,
  PointerMoveEvent,
  PointerUpEvent
} from './types';
import { Dispatch } from 'redux';
import { loadContextMenu, showContextMenu, abortLoadContextMenu, tapTile } from '../actions';

const TAP_TOO_SLOW_TIMEOUT = 'tapTooSlowTimeout';
const LONG_PRESS_TIMEOUT = 'longPressTimeout';

const MAX_UNMOVED_DISTANCE = 5;
const MAX_TAP_TIME = 100;
const MIN_LONG_TOUCH_TIME = 750;

interface TouchData {
  state: 'fresh' | 'hold' | 'move'
  readonly start: Pos
}

export interface TouchEvent extends Pos {
  readonly id: number
  readonly type: string
}

export default class TouchSaga extends EventSaga<TouchData, number> {
  private canInteract = false;
  constructor(eventEmitter: EventEmitter, dispatch: Dispatch) {
    super(eventEmitter, saga => {
      saga.createOn<TouchEvent>(TOUCH_START, ({ x, y, tx, ty }, actor) => {
        actor.data = {
          state: 'fresh',
          start: { x, y, tx, ty }
        };

        actor.emit<PointerDownEvent>(POINTER_DOWN, { id: actor.id, x, y, tx, ty });

        actor.setTimeout(TAP_TOO_SLOW_TIMEOUT, MAX_TAP_TIME);
        actor.setTimeout(LONG_PRESS_TIMEOUT, MIN_LONG_TOUCH_TIME);

      });

      saga.on<TouchEvent>(TOUCH_MOVE, ({ x, y, tx, ty }, actor) => {
        if (actor.data.state === 'fresh') return;

        actor.emit<PointerMoveEvent>(POINTER_MOVE, { id: actor.id, x, y, tx, ty });

        if (actor.data.state === 'hold') {
          const moved = Math.abs(x - actor.data.start.x) > MAX_UNMOVED_DISTANCE
            || Math.abs(y - actor.data.start.y) > MAX_UNMOVED_DISTANCE;
          if (moved) {
            actor.data.state = 'move';
            actor.clearTimeout(LONG_PRESS_TIMEOUT);

            if (this.canInteract) {
              dispatch(abortLoadContextMenu());
            }
          }
        }
      });

      saga.on(TAP_TOO_SLOW_TIMEOUT, (_, actor) => {
        actor.data.state = 'hold';
        if (this.canInteract) {
          dispatch(loadContextMenu(actor.data.start.tx, actor.data.start.ty));
        }
      });

      saga.on<Pos>(LONG_PRESS_TIMEOUT, (_, actor) => {
        if (this.canInteract) {
          dispatch(showContextMenu());
          actor.emit<PointerUpEvent>(POINTER_UP, { id: actor.id });
          actor.done();
        }
      });

      saga.on<TouchEvent>(TOUCH_END, ({ x, y, tx, ty }, actor) => {
        if (actor.data.state === 'fresh') {
          if (this.canInteract) {
            dispatch(tapTile(actor.data.start.tx, actor.data.start.ty));
          }

          actor.emit(POINTER_TAP, { x, y, tx, ty });
        }

        if (actor.data.state === 'hold' && this.canInteract) {
          dispatch(abortLoadContextMenu());
        }

        actor.emit<PointerUpEvent>(POINTER_UP, { id: actor.id });
        actor.done();
      });
    });
  }

  disable() {
    this.canInteract = false;
  }

  enable() {
    this.canInteract = true;
  }
}
