import { EventEmitter } from 'events';
import { Observable } from 'rxjs';
import { Dispatch } from 'redux';

import { TouchEvent } from './TouchSaga';
import PanZoomSaga from './PanZoomSaga';
import SelectionSaga from './SelectionSaga';
import { SelectionState } from '../reduce/selection';
import DoubleTapSaga from './DoubleTapSaga';
import TouchSaga from './TouchSaga';

export default class TouchControls {
  private readonly panZoomSaga: PanZoomSaga;
  private readonly selectionSaga: SelectionSaga;
  private readonly doubleTapSaga: DoubleTapSaga;
  private readonly touchSaga: TouchSaga;
  constructor(touches: Observable<TouchEvent>, dispatch: Dispatch){
    const emitter = new EventEmitter();
    touches.subscribe(touch => emitter.emit(touch.type, touch));
    this.touchSaga = new TouchSaga(emitter, dispatch);
    this.panZoomSaga = new PanZoomSaga(emitter);
    this.selectionSaga = new SelectionSaga(emitter, dispatch);
    this.doubleTapSaga = new DoubleTapSaga(emitter, dispatch);
  }

  getChangedTouches(){
    return this.panZoomSaga.process();
  }

  setSelection(selection: SelectionState){
    this.selectionSaga.setSelection(selection);
  }

  disable(){
    this.touchSaga.disable();
    this.doubleTapSaga.disable();
  }

  enable(){
    this.touchSaga.enable();
    this.doubleTapSaga.enable();
  }
}