export default class TouchControls{
  constructor(renderer){
    this.renderer = renderer;
    this.pointers = [];
  }

  listen(element){
    element.addEventListener('touchstart', event => this.touchStart(event), false);
    element.addEventListener('touchmove', event => this.touchMove(event), false);
    element.addEventListener('touchend', event => this.touchEnd(event), false);
  }

  touchStart(event){
    const touches = Array.from(event.changedTouches);
    this.pointers = this.pointers.concat(touches.map(touch => ({
      px: touch.pageX,
      py: touch.pageY,
      x: touch.pageX,
      y: touch.pageY,
      id: touch.identifier,
      moved: false
    })));

    event.preventDefault();
  }

  touchMove(event){
    const touches = Array.from(event.targetTouches);
    const delta = this.pointers.map(point => ({
      point,
      touch: touches.filter(t => t.identifier === point.id)[0] || {pageX: point.x, pageY: point.y}
    })).map(pair => ({
      px: pair.point.x,
      py: pair.point.y,
      x: pair.touch.pageX,
      y: pair.touch.pageY,
      id: pair.touch.identifier,
      moved: pair.point.moved || !(pair.point.x == pair.touch.pageX && pair.point.y == pair.touch.pageY)
    }));

    this.pointers = delta;

    const avg = delta.reduce((sum, pair, i, c) => ({
      px: sum.px + pair.px/c.length,
      py: sum.py + pair.py/c.length,
      x: sum.x + pair.x/c.length,
      y: sum.y + pair.y/c.length
    }), {px: 0, py: 0, x: 0, y: 0});

    const radius = delta.map(point => ({
      px: avg.px - point.px,
      py: avg.py - point.py,
      x: avg.x - point.x,
      y: avg.y - point.y
    })).reduce((radius, diff, i, c) => ({
      previous: radius.previous + Math.sqrt(diff.px*diff.px + diff.py*diff.py)/c.length,
      next: radius.next + Math.sqrt(diff.x*diff.x + diff.y*diff.y)/c.length
    }), {previous: 1, next: 1});

    this.renderer.panZoom({
      x: avg.px*window.devicePixelRatio,
      y: avg.py*window.devicePixelRatio,
      r: radius.previous
    },{
      x: avg.x*window.devicePixelRatio,
      y: avg.y*window.devicePixelRatio,
      r: radius.next
    });

    event.preventDefault();
  }

  touchEnd(event){
    const touches = Array.from(event.changedTouches);
    const pointersToRemove = touches.map(t => this.pointers.filter(pointer => pointer.id == t.identifier)[0]).filter(x => x);
    this.pointers = this.pointers.filter(pointer => !pointersToRemove.some(touch => touch.id == pointer.id));

    for(const tap of pointersToRemove.filter(p => !p.moved)){
      this.renderer.tap(tap.x*window.devicePixelRatio, tap.y*window.devicePixelRatio);
    }
    event.preventDefault();
  }
}