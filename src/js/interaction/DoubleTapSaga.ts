import { EventEmitter } from 'events';

import {
  POINTER_TAP
} from '../events';

import {
  Pos
} from './types';
import { Dispatch } from 'redux';
import { doubleTapTile } from '../actions';

const MAX_UNMOVED_DISTANCE = 50;
const MAX_HOLD_TIME = 500;

export default class TouchSaga {
  private canInteract = false;
  private changed = 0;
  constructor(eventEmitter: EventEmitter, dispatch: Dispatch){
    let data = {
      x: 0,
      y: 0,
      now: window.performance.now()
    };

    eventEmitter.on(POINTER_TAP, (event: Pos) => {
      const now = window.performance.now();
      if(now - data.now < MAX_HOLD_TIME
        && Math.abs(data.x - event.x) < MAX_UNMOVED_DISTANCE
        && Math.abs(data.y - event.y) < MAX_UNMOVED_DISTANCE
        && (this.canInteract || window.performance.now() - this.changed < 500)){
        dispatch(doubleTapTile(event.tx, event.ty));
      }

      data.now = now;
      data.x = event.x;
      data.y = event.y;
    });
  }

  disable(){
    if(this.canInteract){
      this.canInteract = false;
      this.changed = window.performance.now();
    }
  }

  enable(){
    this.canInteract = true;
  }
}