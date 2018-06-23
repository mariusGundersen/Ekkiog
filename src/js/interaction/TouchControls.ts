import { EventEmitter } from 'events';
import { mat3 } from 'gl-matrix';

import TouchSaga from './TouchSaga';
import PointerSaga from './PointerSaga';
import DoubleTapSaga from './DoubleTapSaga';
import PanZoomSaga from './PanZoomSaga';
import SelectionSaga from './SelectionSaga';

import Perspective from '../Perspective';

export default class TouchControls {
  readonly touchSaga: TouchSaga;
  readonly pointerSaga: PointerSaga;
  readonly doubleTapSaga: DoubleTapSaga;
  readonly panZoomSaga: PanZoomSaga;
  readonly selectionSaga: SelectionSaga;
  readonly emitter: EventEmitter;
  constructor(perspective: Perspective){
    this.emitter = new EventEmitter();
    this.touchSaga = new TouchSaga(this.emitter);
    this.pointerSaga = new PointerSaga(this.emitter);
    this.doubleTapSaga = new DoubleTapSaga(this.emitter);
    this.panZoomSaga = new PanZoomSaga(this.emitter, perspective);
    this.selectionSaga = new SelectionSaga(this.emitter, (x, y) => perspective.viewportToTile(x, y));
  }

  emit(event: string, data: any){
    this.emitter.emit(event, data);
  }
}
