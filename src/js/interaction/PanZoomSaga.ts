import { EventEmitter } from 'events';

import {
  POINTER_DOWN,
  POINTER_MOVE,
  POINTER_UP,
  CANCEL_PAN_ZOOM
} from '../events';

import {
  PointerDownEvent,
  PointerMoveEvent,
  PointerUpEvent,
  CancelPanZoomEvent
} from './types';

interface Pointer {
  x : number,
  y : number,
  tilePos : [number, number]
}

export default class PanZoomSaga {
  private readonly pointers : Map<number, Pointer>;
  private changed : boolean;
  constructor(eventEmitter : EventEmitter){
    this.pointers = new Map<number, Pointer>();
    this.changed = false;

    eventEmitter.on(POINTER_DOWN, (data : PointerDownEvent) => {
      this.pointers.set(data.id, {
        x: data.x,
        y: data.y,
        tilePos: [data.tx, data.ty]
      });
    });

    eventEmitter.on(POINTER_MOVE, (data : PointerMoveEvent) => {
      if(!this.pointers.has(data.id)) return;

      const pointer = this.pointers.get(data.id);
      if(pointer === undefined) return;
      this.changed = true;
      pointer.x = data.x;
      pointer.y = data.y;
    });

    eventEmitter.on(CANCEL_PAN_ZOOM, (data : CancelPanZoomEvent) => {
      if(!this.pointers.has(data.id)) return;
      this.pointers.delete(data.id);
    });

    eventEmitter.on(POINTER_UP, (data : PointerUpEvent) => {
      if(!this.pointers.has(data.id)) return;
      this.pointers.delete(data.id);
    });
  }

  process(){
    if(this.changed === false) return false;

    this.changed = false;

    if(this.pointers.size === 0) return false;

    return [...this.pointers.values()];
  }
}
