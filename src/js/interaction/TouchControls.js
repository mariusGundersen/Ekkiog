import TouchSaga from './TouchSaga.js';
import PointerSaga from './PointerSaga.js';
import PanZoomSaga from './PanZoomSaga.js';
import SelectionSaga from './SelectionSaga.js';

export default class TouchControls{
  constructor(emitter, perspective){
    this.touchSaga = new TouchSaga(emitter);
    this.pointerSaga = new PointerSaga(emitter);
    this.panZoomSaga = new PanZoomSaga(emitter);
    this.selectionSaga = new SelectionSaga(emitter, perspective);
  }
}
