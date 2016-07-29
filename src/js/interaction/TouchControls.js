import {EventEmitter} from 'events';
import EventSaga from 'event-saga';

import TouchSaga from './TouchSaga.js';
import PanZoomSaga from './PanZoomSaga.js';

export default class TouchControls{
  constructor(renderer){
    this.renderer = renderer;
    this.pointers = [];
    this.emitter = new EventEmitter();
    const touchSaga = new TouchSaga(this.emitter);
    const panZoomSaga = new PanZoomSaga(this.emitter);

    this.emitter.on('tap', data => {
      this.renderer.tap(data.x, data.y);
    });

    this.emitter.on('longPress', data => {
      this.renderer.longPress(data.x, data.y);
    });

    this.emitter.on('panZoom', data => {
      this.renderer.panZoom(data.previous, data.current);
    });
  }

  listen(element){
    element.addEventListener('touchstart', emitTouchEvents(this.emitter, 'touchStart'), false);
    element.addEventListener('touchmove', emitTouchEvents(this.emitter, 'touchMove'), false);
    element.addEventListener('touchend', emitTouchEvents(this.emitter, 'touchEnd'), false);
  }
}

function emitTouchEvents(emitter, type){
  return event => {
    for(let touch of event.changedTouches){
      emitter.emit(type, {
        id: touch.identifier,
        x: touch.pageX*window.devicePixelRatio,
        y: touch.pageY*window.devicePixelRatio
      });
    }

    event.preventDefault();
  }
}