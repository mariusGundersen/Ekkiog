import { EventEmitter } from 'events';
import { mat3 } from 'gl-matrix';

import TouchSaga from './TouchSaga';
import PointerSaga from './PointerSaga';
import PanZoomSaga from './PanZoomSaga';
import SelectionSaga from './SelectionSaga';

import Perspective from '../Perspective';

export default class TouchControls {
  touchSaga : TouchSaga;
  pointerSaga : PointerSaga;
  panZoomSaga : PanZoomSaga;
  selectionSaga : SelectionSaga;
  constructor(emitter : EventEmitter, perspective : Perspective){
    this.touchSaga = new TouchSaga(emitter);
    this.pointerSaga = new PointerSaga(emitter);
    this.panZoomSaga = new PanZoomSaga(emitter, perspective);
    this.selectionSaga = new SelectionSaga(emitter, (x, y) => perspective.viewportToTile(x, y));
  }
}
