import TouchSaga from './TouchSaga.js';
import PanZoomSaga from './PanZoomSaga.js';

export default class TouchControls{
  constructor(emitter){
    this.touchSaga = new TouchSaga(emitter);
    this.panZoomSaga = new PanZoomSaga(emitter);
  }
}
