import ViewEngine from './view/ViewEngine.js';
import TileMapEngine from './tileMap/TileMapEngine.js';
import ChargeMapEngine from './chargeMap/ChargeMapEngine.js';
import NetChargeEngine from './netCharges/NetChargeEngine.js';
import MoveEngine from './move/MoveEngine.js';
import TextEngine from './text/TextEngine.js';
import DebugEngine from './debug/DebugEngine.js';
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
    this.textEngine = new TextEngine(gl);
    this.debugEngine = new DebugEngine(gl);
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

    triangle.bind();

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
    triangle.bind();
    this.viewEngine.render(context, mapToViewportMatrix);
    this.textEngine.render(context, mapToViewportMatrix);
    if(window.debug){
      this.debugEngine.render(context.wordTexture, mapToViewportMatrix);
    }
  }

  renderMove(context, mapToViewportMatrix, {top, left, right, bottom}, dx, dy){
    triangle.bind();
    this.moveEngine.render(context, mapToViewportMatrix, [top, left, right, bottom], dx, dy);
  }
}
