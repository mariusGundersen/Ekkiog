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
  constructor(emitter : EventEmitter){
    this.canInteract = true;

    maybeEmit(emitter, () => this.canInteract, POINTER_TAP, TAP);
    maybeEmit(emitter, () => this.canInteract, POINTER_DOUBLE_TAP, DOUBLE_TAP);
    maybeEmit(emitter, () => this.canInteract, LONG_PRESS, SHOW_CONTEXT_MENU);
    maybeEmit(emitter, () => this.canInteract, POTENTIAL_LONG_PRESS, LOAD_CONTEXT_MENU);
    maybeEmit(emitter, () => this.canInteract, POTENTIAL_LONG_PRESS_CANCEL, ABORT_LOAD_CONTEXT_MENU);
  }

  disable(){
    this.canInteract = false;
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