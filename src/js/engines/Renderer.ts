import { mat3, vec2 } from 'gl-matrix';
import { Box } from 'ekkiog-editing';

import ViewEngine from './view/ViewEngine';
import TileMapEngine from './tileMap/TileMapEngine';
import ChargeMapEngine from './chargeMap/ChargeMapEngine';
import NetChargeEngine from './netCharges/NetChargeEngine';
import MoveEngine from './move/MoveEngine';
import TextEngine from './text/TextEngine';
import DebugEngine from './debug/DebugEngine';

import Context from '../Context';

export default class Renderer {
  gl : WebGLRenderingContext;
  currentTick : number;
  netChargeEngine : NetChargeEngine;
  chargeMapEngine : ChargeMapEngine;
  tileMapEngine : TileMapEngine;
  viewEngine : ViewEngine;
  moveEngine : MoveEngine;
  textEngine : TextEngine;
  debugEngine : DebugEngine;
  constructor(gl : WebGLRenderingContext) {
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
  }

  renderMap(context : Context){
    this.tileMapEngine.render(
      context.mapTexture,
      context.tileMapTexture);
  }

  simulateTick(context : Context, tick=this.currentTick){
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

  renderView(context : Context, mapToViewportMatrix : mat3, viewportSize : vec2) {
    this.gl.viewport(0, 0, viewportSize[0], viewportSize[1]);
    this.viewEngine.render(context, mapToViewportMatrix);
    this.textEngine.render(context, mapToViewportMatrix);
    if('debug' in window){
      this.debugEngine.render(context.chargeMapTexture, mapToViewportMatrix);
    }
  }

  renderMove(context : Context, mapToViewportMatrix : mat3, {top, left, right, bottom} : Box, dx : number, dy : number){
    this.moveEngine.render(context, mapToViewportMatrix, [top, left, right, bottom], dx, dy);
  }
}
