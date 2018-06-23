import { EventEmitter } from 'events';
import EventSaga from 'event-saga';

import {
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
import { SelectionState } from '../reduce/selection';

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

interface Data {
  dx: number,
  dy: number
}

export default class SelectionSaga extends EventSaga<Data, any> {
  private state : SelectionState;
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
            dx: this.state.dx - tx,
            dy: this.state.dy - ty
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
        const dx = Math.round(tx + actor.data.dx);
        const dy = Math.round(ty + actor.data.dy);
        if(dx != this.state.dx || dy != this.state.dy){
          eventEmitter.emit(MOVE_SELECTION, {
            dx,
            dy
          });
        }
      });

      saga.on<PointerUpEvent>(POINTER_UP, (_, actor) => {
        actor.done();
      });
    });

    this.state = {
      selection: false
    };
  }

  setSelection(state: SelectionState){
    this.state = state;
  }
}