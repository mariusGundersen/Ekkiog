import { EventEmitter } from 'events';

import TouchSaga from './TouchSaga';
import PointerSaga from './PointerSaga';
import DoubleTapSaga from './DoubleTapSaga';
import PanZoomSaga from './PanZoomSaga';
import SelectionSaga from './SelectionSaga';


export default class TouchControls {
  readonly touchSaga: TouchSaga;
  readonly pointerSaga: PointerSaga;
  readonly doubleTapSaga: DoubleTapSaga;
  readonly panZoomSaga: PanZoomSaga;
  readonly selectionSaga: SelectionSaga;
  readonly emitter: EventEmitter;
  constructor(viewportToTile: (x: number, y: number) => [number, number]){
    this.emitter = new EventEmitter();
    this.touchSaga = new TouchSaga(this.emitter, viewportToTile);
    this.pointerSaga = new PointerSaga(this.emitter);
    this.doubleTapSaga = new DoubleTapSaga(this.emitter);
    this.panZoomSaga = new PanZoomSaga(this.emitter);
    this.selectionSaga = new SelectionSaga(this.emitter);
  }

  emit(event: string, data: any){
    this.emitter.emit(event, data);
  }
}
