import { EventEmitter } from 'events';
import { mat3 } from 'gl-matrix';

import TouchSaga from './TouchSaga';
import PointerSaga from './PointerSaga';
import PanZoomSaga from './PanZoomSaga';
import SelectionSaga from './SelectionSaga';

export default class TouchControls {
  touchSaga : TouchSaga;
  pointerSaga : PointerSaga;
  panZoomSaga : PanZoomSaga;
  selectionSaga : SelectionSaga;
  constructor(emitter : EventEmitter, viewportToTile : (x : number, y : number) => [number, number]){
    this.touchSaga = new TouchSaga(emitter);
    this.pointerSaga = new PointerSaga(emitter);
    this.panZoomSaga = new PanZoomSaga(emitter);
    this.selectionSaga = new SelectionSaga(emitter, viewportToTile);
  }
}
