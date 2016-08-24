import EventSaga from 'event-saga';

import {
  START_SELECTION,
  MOVE_SELECTION,
  POINTER_DOWN,
  POINTER_MOVE,
  POINTER_UP,
  CANCEL_PAN_ZOOM
} from '../events.js';

export default class SelectionSaga {
  constructor(eventEmitter, perspective){
    let state = {
      selection: false
    };

    eventEmitter.on(START_SELECTION, (data) => {
      console.log('startSelection', data);
      state = {
        selection: true,
        top: data.top,
        left: data.left,
        right: data.right,
        bottom: data.bottom,
        pointer: null,
        dx: 0,
        dy: 0
      };
    });

    eventEmitter.on(POINTER_DOWN, (data) => {
      if(!state.selection) return;

      const [tx, ty] = perspective.viewportToTile(data.x, data.y);
      console.log(tx, ty);
      if(state.top <= Math.floor(ty - state.dy) && state.bottom >= Math.floor(ty - state.dy)
      && state.left <= Math.floor(tx - state.dx) && state.right >= Math.floor(tx - state.dx)){
        console.log('inside');

        if(state.pointer == null){
          state.pointer = {
            id: data.pointer,
            tx,
            ty
          };
        }

        eventEmitter.emit(CANCEL_PAN_ZOOM, {
          pointer: data.pointer
        });
      }else{
        console.log('outside');
      }
    });

    eventEmitter.on(POINTER_MOVE, (data) => {
      if(!state.selection) return;
      if(state.pointer == null || state.pointer.id != data.pointer) return;

      const [tx, ty] = perspective.viewportToTile(data.x, data.y);
      eventEmitter.emit(MOVE_SELECTION, {
        tx: Math.round(tx + state.dx - state.pointer.tx),
        ty: Math.round(ty + state.dy - state.pointer.ty)
      });
    });

    eventEmitter.on(POINTER_UP, (data) => {
      if(!state.selection) return;
      if(state.pointer == null || state.pointer.id != data.pointer) return;

      const [tx, ty] = perspective.viewportToTile(data.x, data.y);
      state.dx = Math.round(tx + state.dx - state.pointer.tx);
      state.dy = Math.round(ty + state.dy - state.pointer.ty);
      console.log('up', state.dx, state.dy);
      state.pointer = null;
    });
  }
}