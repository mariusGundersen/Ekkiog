import EventSaga from 'event-saga';

import {
  POINTER_DOWN,
  POINTER_MOVE,
  POINTER_UP,
} from '../events.js';

export default class PanZoomSaga{
  constructor(eventEmitter){
    const pointers = new Map();
    this.pointers = pointers;

    eventEmitter.on(POINTER_DOWN, function(data){
      pointers.set(data.pointer, {
        x: data.x,
        y: data.y,
        ox: data.x,
        oy: data.y
      });
    });

    eventEmitter.on(POINTER_MOVE, function(data){
      if(!pointers.has(data.pointer)) return;

      const pointer = pointers.get(data.pointer);
      pointer.x = data.x;
      pointer.y = data.y;
    });

    eventEmitter.on(POINTER_UP, function(data){
      if(!pointers.has(data.pointer)) return;

      pointers.delete(data.pointer);
    });
  }

  process(){
    const current = [...this.pointers.values()];

    if(current.filter(p => p.ox != p.x || p.oy != p.y).length == 0) return null;

    const previous = current.map(p => ({
      x: p.ox,
      y: p.oy
    }));

    current.forEach(pointer => {
      pointer.ox = pointer.x;
      pointer.oy = pointer.y;
    });

    return {
      previous: getXYR(previous),
      current: getXYR(current)
    };
  }
}

function getXYR(pointers){
  const avgX = pointers.reduce((sum, pair, i, c) => sum + pair.x/c.length, 0);
  const avgY = pointers.reduce((sum, pair, i, c) => sum + pair.y/c.length, 0);

  const deltaX = pointers.map(point => (avgX - point.x)*(avgX - point.x));
  const deltaY = pointers.map(point => (avgY - point.y)*(avgY - point.y));

  let radius = 0;
  for(let i=0; i<deltaX.length; i++){
    radius += Math.sqrt(deltaX[i] + deltaY[i])/pointers.length;
  }

  return {
    x: avgX,
    y: avgY,
    r: radius || 1
  };
}
