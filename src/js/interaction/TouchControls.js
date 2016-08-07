import TouchSaga from './TouchSaga.js';
import PanZoomSaga from './PanZoomSaga.js';

export default class TouchControls{
  constructor(emitter){
    const touchSaga = new TouchSaga(emitter);
    this.panZoomSaga = new PanZoomSaga(emitter);
  }
}
