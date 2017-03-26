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
  ABORT_LOAD_CONTEXT_MENU
} from '../events';

import {
  HIDE_CONTEXT_MENU
} from '../actions';

export default class PointerSaga{
  constructor(emitter){
    this.canTap = true;
    this.canShowContextMenu = true;

    maybeEmit(emitter, () => this.canTap, POINTER_TAP, TAP);
    maybeEmit(emitter, () => this.canShowContextMenu, LONG_PRESS, SHOW_CONTEXT_MENU);
    maybeEmit(emitter, () => this.canShowContextMenu, POTENTIAL_LONG_PRESS, LOAD_CONTEXT_MENU);
    maybeEmit(emitter, () => this.canShowContextMenu, POTENTIAL_LONG_PRESS_CANCEL, ABORT_LOAD_CONTEXT_MENU);

    emitter.on(START_SELECTION, () => this.disableAll());
    emitter.on(STOP_SELECTION, () => this.enableAll());

    emitter.on(SHOW_CONTEXT_MENU, () => this.disableAll());
    emitter.on(HIDE_CONTEXT_MENU, () => this.enableAll());
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

function maybeEmit(emitter, condition, when, then){
  emitter.on(when, data => {
    if(condition()){
      emitter.emit(then, data);
    }
  });
}