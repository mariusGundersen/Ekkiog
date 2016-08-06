import TouchSaga from './TouchSaga.js';
import PanZoomSaga from './PanZoomSaga.js';

export default class TouchControls{
  constructor(emitter){
    const touchSaga = new TouchSaga(emitter);
    this.panZoomSaga = new PanZoomSaga(emitter);
  }

  panZoom(perspective){
    const result = this.panZoomSaga.process();
    if(result !== null){
      perspective.panZoom(result.previous, result.current);
    }
  }
}
