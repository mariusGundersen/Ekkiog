import { EventEmitter } from 'events';
import { mat3 } from 'gl-matrix';

import TouchSaga from './TouchSaga';
import PointerSaga from './PointerSaga';
import DoubleTapSaga from './DoubleTapSaga';
import PanZoomSaga from './PanZoomSaga';
import SelectionSaga from './SelectionSaga';

import Perspective from '../Perspective';

export default class TouchControls {
  readonly touchSaga : TouchSaga;
  readonly pointerSaga : PointerSaga;
  readonly doubleTapSaga : DoubleTapSaga;
  readonly panZoomSaga : PanZoomSaga;
  readonly selectionSaga : SelectionSaga;
  constructor(emitter : EventEmitter, perspective : Perspective){
    this.touchSaga = new TouchSaga(emitter);
    this.pointerSaga = new PointerSaga(emitter);
    this.doubleTapSaga = new DoubleTapSaga(emitter);
    this.panZoomSaga = new PanZoomSaga(emitter, perspective);
    this.selectionSaga = new SelectionSaga(emitter, (x, y) => perspective.viewportToTile(x, y));
  }
}
