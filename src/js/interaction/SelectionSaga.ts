import { EventEmitter } from 'events';
import EventSaga from 'event-saga';
import { mat3 } from 'gl-matrix';

import {
  START_SELECTION,
  STOP_SELECTION,
  MOVE_SELECTION,
  POINTER_DOWN,
  POINTER_MOVE,
  POINTER_UP,
  CANCEL_PAN_ZOOM
} from '../events';

import {
  PointerDownEvent,
  PointerMoveEvent,
  PointerUpEvent,
  StartSelectionEvent
} from './types';

type State = StateSelection | StateNoSelection;

interface StateNoSelection {
  selection : false
}

interface StateSelection {
  selection : true;
  top : number;
  left : number;
  right : number;
  bottom : number;
  dx : number;
  dy : number;
}

export default class SelectionSaga extends EventSaga<any, any> {
  state : State;
  constructor(eventEmitter : EventEmitter, viewportToTile : (x : number, y : number) => [number, number]){
    super(eventEmitter, saga => {
      saga.createOn<PointerDownEvent>(POINTER_DOWN, (data, actor) => {
        if(!this.state.selection) {
          actor.done();
          return;
        }

        const [tx, ty] = viewportToTile(data.x, data.y);
        if(this.state.top <= Math.floor(ty - this.state.dy)
        && this.state.left <= Math.floor(tx - this.state.dx)
        && this.state.right >= Math.floor(tx - this.state.dx)
        && this.state.bottom >= Math.floor(ty - this.state.dy)){
          actor.data = {
            tx,
            ty,
            dx: this.state.dx,
            dy: this.state.dy
          };

          actor.emit(CANCEL_PAN_ZOOM, {
            id: data.id
          });
        }else{
          actor.done();
        }
      });

      saga.on<PointerMoveEvent>(POINTER_MOVE, (data, actor) => {
        if(!this.state.selection) {
          actor.done();
          return;
        }

        const [tx, ty] = viewportToTile(data.x, data.y);
        this.state.dx = Math.round(tx - actor.data.tx + actor.data.dx);
        this.state.dy = Math.round(ty - actor.data.ty + actor.data.dy);
        eventEmitter.emit(MOVE_SELECTION, {
          dx: this.state.dx,
          dy: this.state.dy
        });
      });

      saga.on<PointerUpEvent>(POINTER_UP, (data, actor) => {
        if(!this.state.selection) {
          actor.done();
          return;
        }

        const [tx, ty] = viewportToTile(data.x, data.y);
        actor.data.dx = Math.round(tx - actor.data.tx + this.state.dx - actor.data.dx);
        actor.data.dy = Math.round(ty - actor.data.ty + this.state.dy - actor.data.dy);
        actor.done();
      });
    });

    this.state = {
      selection: false
    };

    eventEmitter.on(START_SELECTION, (data : StartSelectionEvent) => {
      this.state = {
        selection: true,
        top: data.top,
        left: data.left,
        right: data.right,
        bottom: data.bottom,
        dx: 0,
        dy: 0
      };
    });

    eventEmitter.on(STOP_SELECTION, () => {
      this.state = {
        selection: false
      };
    });
  }
}