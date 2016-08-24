import EventSaga from 'event-saga';

import {
  START_SELECTION,
  POINTER_DOWN,
  POINTER_MOVE,
  POINTER_UP,
  CANCEL_PAN_ZOOM
} from '../events.js';

export default class SelectionSaga extends EventSaga {
  constructor(eventEmitter, perspective){
    super(eventEmitter, saga => {
      saga.createOn(POINTER_DOWN, (data, actor) => {
        if(!this.state.selection) {
          actor.done();
          return;
        }

        const [tx, ty] = perspective.viewportToTile(data.x, data.y);
        console.log(tx, ty);
        if(this.state.top <= Math.floor(ty - this.state.dy)
        && this.state.left <= Math.floor(tx - this.state.dx)
        && this.state.right >= Math.floor(tx - this.state.dx)
        && this.state.bottom >= Math.floor(ty - this.state.dy)){
          actor.data = {
            tx,
            ty,
            dx: this.state.dx,
            dy: this.state.dy
          };

          actor.emit(CANCEL_PAN_ZOOM, {
            id: data.id
          });
        }else{
          actor.done();
        }
      });

      saga.on(POINTER_MOVE, (data, actor) => {
        if(!this.state.selection) {
          actor.done();
          return;
        }

        const [tx, ty] = perspective.viewportToTile(data.x, data.y);
        this.state.dx = Math.round(tx - actor.data.tx + actor.data.dx);
        this.state.dy = Math.round(ty - actor.data.ty + actor.data.dy);
      });

      saga.on(POINTER_UP, (data, actor) => {
        if(!this.state.selection) {
          actor.done();
          return;
        }

        const [tx, ty] = perspective.viewportToTile(data.x, data.y);
        actor.data.dx = Math.round(tx - actor.data.tx + this.state.dx - actor.data.dx);
        actor.data.dy = Math.round(ty - actor.data.ty + this.state.dy - actor.data.dy);
        actor.done();
      });
    });

    this.state = {
      selection: false
    };

    eventEmitter.on(START_SELECTION, (data) => {
      console.log('startSelection', data);
      this.state = {
        selection: true,
        top: data.top,
        left: data.left,
        right: data.right,
        bottom: data.bottom,
        dx: 0,
        dy: 0
      };
    });
  }

  get isSelectionActive(){
    return this.state.selection;
  }
  get dx(){
    return this.state.dx;
  }
  get dy(){
    return this.state.dy;
  }
  get boundingBox(){
    return [this.state.top, this.state.left, this.state.right, this.state.bottom];
  }
}