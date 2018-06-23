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
  x: number,
  y: number,
  readonly tx: number,
  readonly ty: number
}

export default class PanZoomSaga {
  private readonly pointers = new Map<number, Pointer>();
  private changed = false;
  constructor(eventEmitter: EventEmitter){
    eventEmitter.on(POINTER_DOWN, (data: PointerDownEvent) => {
      this.pointers.set(data.id, {
        x: data.x,
        y: data.y,
        tx: data.tx,
        ty: data.ty,
      });
    });

    eventEmitter.on(POINTER_MOVE, (data: PointerMoveEvent) => {
      if(!this.pointers.has(data.id)) return;

      const pointer = this.pointers.get(data.id);
      if(pointer === undefined) return;
      this.changed = true;
      pointer.x = data.x;
      pointer.y = data.y;
    });

    eventEmitter.on(CANCEL_PAN_ZOOM, (data: CancelPanZoomEvent) => {
      if(!this.pointers.has(data.id)) return;
      this.pointers.delete(data.id);
    });

    eventEmitter.on(POINTER_UP, (data: PointerUpEvent) => {
      if(!this.pointers.has(data.id)) return;
      this.pointers.delete(data.id);
    });
  }

  process(){
    if(this.changed === false) return false;

    this.changed = false;

    if(this.pointers.size === 0) return false;

    return [...this.pointers.values()].map(toPair);
  }
}

const toPair = ({ x, y, tx, ty } : Pointer) => ({
  tilePos: [tx, ty] as [number, number],
  viewPos: [x, y] as [number, number]
});