import { EventEmitter } from 'events';

import {
  START_SELECTION,
  STOP_SELECTION,
  POINTER_TAP,
  TAP,
  LONG_PRESS,
  SHOW_CONTEXT_MENU,
  POTENTIAL_LONG_PRESS,
  LOAD_CONTEXT_MENU,
  POTENTIAL_LONG_PRESS_CANCEL,
  ABORT_LOAD_CONTEXT_MENU,
  HIDE_CONTEXT_MENU
} from '../events';

export default class PointerSaga {
  private canTap : boolean;
  private canShowContextMenu : boolean;
  constructor(emitter : EventEmitter){
    this.canTap = true;
    this.canShowContextMenu = true;

    maybeEmit(emitter, () => this.canTap, POINTER_TAP, TAP);
    maybeEmit(emitter, () => this.canShowContextMenu, LONG_PRESS, SHOW_CONTEXT_MENU);
    maybeEmit(emitter, () => this.canShowContextMenu, POTENTIAL_LONG_PRESS, LOAD_CONTEXT_MENU);
    maybeEmit(emitter, () => this.canShowContextMenu, POTENTIAL_LONG_PRESS_CANCEL, ABORT_LOAD_CONTEXT_MENU);
  }

  disableAll(){
    this.canTap = false;
    this.canShowContextMenu = false;
  }

  enableAll(){
    this.canTap = true;
    this.canShowContextMenu = true;
  }
}

function maybeEmit(emitter : EventEmitter, condition : () => boolean, when : string, then : string){
  emitter.on(when, (data : any) => {
    if(condition()){
      emitter.emit(then, data);
    }
  });
}