import EventSaga from 'event-saga';

export default class PanZoomSaga{
  constructor(eventEmitter){
    const pointers = new Map();

    eventEmitter.on('pointer-down', function(data){
      pointers.set(data.pointer, {
        x: data.x,
        y: data.y,
        dx: 0,
        dy: 0
      });
    });

    eventEmitter.on('pointer-move', function(data){
      if(!pointers.has(data.pointer)) return;

      pointers.set(data.pointer, data);
      const current = [...pointers.values()];

      if(current.length == 0) return;

      const previous = current.map(p => ({
        x: p.x - p.dx,
        y: p.y - p.dy
      }));

      eventEmitter.emit('panZoom', {
        previous: getXYR(previous),
        current: getXYR(current)
      });
    });

    eventEmitter.on('pointer-up', function(data){
      if(!pointers.has(data.pointer)) return;

      pointers.delete(data.pointer);
    });
  }
}

function getXYR(pointers){
  const avg = pointers.reduce((sum, pair, i, c) => ({
    x: sum.x + pair.x/c.length,
    y: sum.y + pair.y/c.length
  }), {x: 0, y: 0});

  const radius = pointers.map(point => ({
    x: avg.x - point.x,
    y: avg.y - point.y
  })).reduce((radius, {x, y}, i, c) => radius + Math.sqrt(x*x + y*y)/c.length, 0);

  return {
    x: avg.x,
    y: avg.y,
    r: radius || 1
  };
}
