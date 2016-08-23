import ViewEngine from './view/ViewEngine.js';
import TileMapEngine from './tileMap/TileMapEngine.js';
import ChargeMapEngine from './chargeMap/ChargeMapEngine.js';
import NetChargeEngine from './netCharges/NetChargeEngine.js';
import * as triangle from './triangle.js';

export default class Renderer {
  constructor(gl) {
    this.gl = gl;
    this.currentTick = 0;

    this.netChargeEngine = new NetChargeEngine(gl);
    this.chargeMapEngine = new ChargeMapEngine(gl);
    this.tileMapEngine = new TileMapEngine(gl);
    this.viewEngine = new ViewEngine(gl);
    triangle.initialize(gl);
  }

  renderMap(context){
    this.tileMapEngine.render(context);
    this.chargeMapEngine.render(context, this.currentTick);
  }

  simulateTick(context, tick){
    this.currentTick = tick;
    this.netChargeEngine.render(context, tick);
    this.chargeMapEngine.render(context, tick);
  }

  renderView(context, perspective) {
    this.gl.viewport(0, 0, ...perspective.viewportSize);

    this.viewEngine.render(context, perspective.mapToViewportMatrix);
  }
}
