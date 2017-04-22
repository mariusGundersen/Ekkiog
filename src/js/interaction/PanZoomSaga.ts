import { EventEmitter } from 'events';

import {
  POINTER_DOWN,
  POINTER_MOVE,
  POINTER_UP,
  CANCEL_PAN_ZOOM
} from '../events';

import {
  Pos,
  PointerDownEvent,
  PointerMoveEvent,
  PointerUpEvent,
  CancelPanZoomEvent
} from './types';

import Perspective, { MapPos, SquarePos } from '../Perspective';

interface Pointer {
  x : number,
  y : number,
  mapPos : MapPos
}

export default class PanZoomSaga {
  private readonly pointers : Map<number, Pointer>;
  private readonly perspective : Perspective;
  private changed : boolean;
  constructor(eventEmitter : EventEmitter, perspective : Perspective){
    this.pointers = new Map<number, Pointer>();
    this.perspective = perspective;
    this.changed = false;

    eventEmitter.on(POINTER_DOWN, (data : PointerDownEvent) => {
      this.pointers.set(data.id, {
        x: data.x,
        y: data.y,
        mapPos: perspective.viewportToMap(data.x, data.y)
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
    const current = [...this.pointers.values()];

    if(this.changed === false) return false;
    this.changed = false;

    const squarePos = current.map(p => [p.mapPos, this.perspective.viewportToSquare(p.x, p.y)] as [MapPos, SquarePos]);

    this.perspective.transformMapToSquare(...squarePos);

    for(const pos of current){
      pos.mapPos = this.perspective.viewportToMap(pos.x, pos.y);
    }

    return true;
  }
}
