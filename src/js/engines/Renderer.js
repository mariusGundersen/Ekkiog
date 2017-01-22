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

    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.enable(this.gl.BLEND);

    this.netChargeEngine = new NetChargeEngine(gl);
    this.chargeMapEngine = new ChargeMapEngine(gl);
    this.tileMapEngine = new TileMapEngine(gl);
    this.viewEngine = new ViewEngine(gl);
    this.moveEngine = new MoveEngine(gl);
    triangle.initialize(gl);
  }

  renderMap(context){
    this.tileMapEngine.render(
      context.mapTexture,
      context.tileMapTexture);
  }

  simulateTick(context, tick=this.currentTick){
    this.currentTick = tick;

    const prevousCharges = context.netChargeTextures[(tick+1)%2];
    const nextCharges = context.netChargeTextures[tick%2];

    this.netChargeEngine.render(
      prevousCharges,
      context.gatesTexture,
      nextCharges);

    const currentCharges = nextCharges;

    this.chargeMapEngine.render(
      context.netMapTexture,
      currentCharges,
      context.spriteSheetTexture,
      context.chargeMapTexture);
  }

  renderView(context, mapToViewportMatrix, viewportSize) {
    this.gl.viewport(0, 0, ...viewportSize);
    this.viewEngine.render(context, mapToViewportMatrix);
  }

  renderMove(context, mapToViewportMatrix, boundingBox, dx, dy){
    this.moveEngine.render(context, mapToViewportMatrix, boundingBox, dx, dy);
  }
}
