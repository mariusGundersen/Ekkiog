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
import { TileViewPair } from '../Perspective';

const empty: TileViewPair[] = [];

export default class PanZoomSaga {
  private readonly pointers = new Map<number, TileViewPair>();
  private changed = false;
  constructor(eventEmitter: EventEmitter){
    eventEmitter.on(POINTER_DOWN, ({id, tx, ty, x, y}: PointerDownEvent) => {
      this.pointers.set(id, {
        tilePos: [tx, ty] as [number, number],
        viewPos: [x, y] as [number, number]
      });
    });

    eventEmitter.on(POINTER_MOVE, ({id, x, y}: PointerMoveEvent) => {
      const pointer = this.pointers.get(id);
      if(!pointer) return;
      this.changed = true;
      pointer.viewPos[0] = x;
      pointer.viewPos[1] = y;
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
    if(this.changed === false) return empty;

    this.changed = false;

    return [...this.pointers.values()];
  }
}
