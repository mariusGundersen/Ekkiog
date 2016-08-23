import ViewEngine from './view/ViewEngine.js';
import TileMapEngine from './tileMap/TileMapEngine.js';
import ChargeMapEngine from './chargeMap/ChargeMapEngine.js';
import NetChargeEngine from './netCharges/NetChargeEngine.js';
import MoveEngine from './move/MoveEngine.js';
import * as triangle from './triangle.js';

export default class Renderer {
  constructor(gl) {
    this.gl = gl;
    this.currentTick = 0;

    this.netChargeEngine = new NetChargeEngine(gl);
    this.chargeMapEngine = new ChargeMapEngine(gl);
    this.tileMapEngine = new TileMapEngine(gl);
    this.viewEngine = new ViewEngine(gl);
    this.moveEngine = new MoveEngine(gl);
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
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.enable(this.gl.BLEND);
    this.gl.disable(this.gl.DEPTH_TEST);
    this.viewEngine.render(context, perspective.mapToViewportMatrix);
  }

  renderMove(context, perspective, boundingBox){
    this.moveEngine.render(context, perspective.mapToViewportMatrix, boundingBox);
  }
}
