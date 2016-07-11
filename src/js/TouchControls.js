export default class TouchControls{
  constructor(element, renderer){
    this.renderer = renderer;
    this.pointers = [];

    element.addEventListener('touchstart', event => this.touchStart(event), false);
    element.addEventListener('touchmove', event => this.touchMove(event), false);
    element.addEventListener('touchend', event => this.touchEnd(event), false);
  }

  touchStart(event){
    const touches = Array.from(event.targetTouches);
    this.pointers = touches.map(touch => ({
      x: touch.pageX,
      y: touch.pageY,
      id: touch.identifier
    }));
    event.preventDefault();
  }

  touchMove(event){
    const touches = Array.from(event.targetTouches);
    const delta = this.pointers.map(point => ({
      point,
      touch: touches.filter(t => t.identifier === point.id)[0] || {pageX: point.x, pageY: point.y}
    })).map(pair => ({
      dx: pair.point.x - pair.touch.pageX,
      dy: pair.point.y - pair.touch.pageY,
      px: pair.point.x,
      py: pair.point.y,
      x: pair.touch.pageX,
      y: pair.touch.pageY,
      id: pair.touch.identifier
    }));

    this.pointers = delta;

    const avg = delta.reduce((sum, pair, i, c) => ({
      dx: sum.dx + pair.dx/c.length,
      dy: sum.dy + pair.dy/c.length,
      px: sum.px + pair.px/c.length,
      py: sum.py + pair.py/c.length,
      x: sum.x + pair.x/c.length,
      y: sum.y + pair.y/c.length
    }), {dx: 0, dy: 0, px: 0, py: 0, x: 0, y: 0});

    const radius = delta.map(point => ({
      px: avg.px - point.px,
      py: avg.py - point.py,
      x: avg.x - point.x,
      y: avg.y - point.y
    })).reduce((radius, diff, i, c) => ({
      old: radius.old + Math.sqrt(diff.px*diff.px + diff.py*diff.py)/c.length,
      new: radius.new + Math.sqrt(diff.x*diff.x + diff.y*diff.y)/c.length
    }), {old: 0, new: 0});

    this.renderer.moveBy(avg.dx, avg.dy);
    if(radius.old != 0 && radius.new != 0){
      this.renderer.scaleBy(radius.new/radius.old);
    }

    event.preventDefault();
  }

  touchEnd(event){
    const touches = Array.from(event.targetTouches);
    this.pointers = touches.map(touch => ({
      x: touch.pageX,
      y: touch.pageY,
      id: touch.identifier
    }));
    event.preventDefault();
  }
}