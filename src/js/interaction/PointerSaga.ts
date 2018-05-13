import { EventEmitter } from 'events';

import {
  START_SELECTION,
  STOP_SELECTION,
  POINTER_TAP,
  POINTER_DOUBLE_TAP,
  TAP,
  DOUBLE_TAP,
  LONG_PRESS,
  SHOW_CONTEXT_MENU,
  POTENTIAL_LONG_PRESS,
  LOAD_CONTEXT_MENU,
  POTENTIAL_LONG_PRESS_CANCEL,
  ABORT_LOAD_CONTEXT_MENU,
  HIDE_CONTEXT_MENU
} from '../events';

export default class PointerSaga {
  private canInteract : boolean;
  private changed : number;
  constructor(emitter : EventEmitter){
    this.canInteract = true;
    this.changed = 0;

    maybeEmit(emitter, () => this.canInteract, POINTER_TAP, TAP);
    maybeEmit(emitter, () => this.canInteract || window.performance.now() - this.changed < 500, POINTER_DOUBLE_TAP, DOUBLE_TAP);
    maybeEmit(emitter, () => this.canInteract, LONG_PRESS, SHOW_CONTEXT_MENU);
    maybeEmit(emitter, () => this.canInteract, POTENTIAL_LONG_PRESS, LOAD_CONTEXT_MENU);
    maybeEmit(emitter, () => this.canInteract, POTENTIAL_LONG_PRESS_CANCEL, ABORT_LOAD_CONTEXT_MENU);
  }

  disable(){
    this.canInteract = false;
    this.changed = window.performance.now();
  }

  enable(){
    this.canInteract = true;
  }
}

function maybeEmit(emitter : EventEmitter, condition : () => boolean, when : string, then : string){
  emitter.on(when, (data : any) => {
    if(condition()){
      emitter.emit(then, data);
    }
  });
}