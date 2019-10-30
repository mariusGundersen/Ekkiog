import { EventEmitter } from 'events';
import EventSaga from 'event-saga';

import {
  POINTER_DOWN,
  POINTER_MOVE,
  POINTER_UP,
  CANCEL_PAN_ZOOM
} from '../events';

import {
  PointerDownEvent,
  PointerMoveEvent,
  PointerUpEvent
} from './types';
import { SelectionState } from '../reduce/selection';
import { Dispatch } from 'redux';
import { moveSelection } from '../actions';

interface State {
  dx: number,
  dy: number
}

export default class SelectionSaga extends EventSaga<State, any> {
  private state: SelectionState;
  constructor(eventEmitter: EventEmitter, dispatch: Dispatch) {
    super(eventEmitter, saga => {
      saga.createOn<PointerDownEvent>(POINTER_DOWN, ({ id, tx, ty }, actor) => {
        if (!this.state) {
          actor.done();
          return;
        }

        if (this.state.top <= Math.floor(ty - this.state.dy)
          && this.state.left <= Math.floor(tx - this.state.dx)
          && this.state.right >= Math.floor(tx - this.state.dx)
          && this.state.bottom >= Math.floor(ty - this.state.dy)) {
          actor.data = {
            dx: this.state.dx - tx,
            dy: this.state.dy - ty
          };

          actor.emit(CANCEL_PAN_ZOOM, { id });
        } else {
          actor.done();
        }
      });

      saga.on<PointerMoveEvent>(POINTER_MOVE, ({ tx, ty }, actor) => {
        if (!this.state) {
          actor.done();
          return;
        }

        const dx = Math.round(tx + actor.data.dx);
        const dy = Math.round(ty + actor.data.dy);
        if (dx != this.state.dx || dy != this.state.dy) {
          dispatch(moveSelection(dx, dy));
        }
      });

      saga.on<PointerUpEvent>(POINTER_UP, (_, actor) => {
        actor.done();
      });
    });

    this.state = null;
  }

  setSelection(state: SelectionState) {
    this.state = state;
  }
}
