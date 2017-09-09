import { mat3 } from 'gl-matrix';
import { Box } from 'ekkiog-editing';

import ViewEngine from './ViewEngine';
import TileMapEngine from './TileMapEngine';
import ChargeMapEngine from './ChargeMapEngine';
import NetChargeEngine from './NetChargeEngine';
import MoveEngine from './MoveEngine';
import WordEngine from './WordEngine';
import DebugEngine from './DebugEngine';

import { RenderContext } from './textures/types';

export default class Renderer {
  private readonly gl : WebGLRenderingContext;
  private currentTick : number;
  private readonly netChargeEngine : NetChargeEngine;
  private readonly chargeMapEngine : ChargeMapEngine;
  private readonly tileMapEngine : TileMapEngine;
  private readonly viewEngine : ViewEngine;
  private readonly moveEngine : MoveEngine;
  private readonly wordEngine : WordEngine;
  private readonly debugEngine : DebugEngine;
  private width : number;
  private height : number;
  constructor(gl : WebGLRenderingContext, width : number, height : number) {
    this.gl = gl;
    this.currentTick = 0;
    this.width = width;
    this.height = height;

    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.enable(this.gl.BLEND);

    this.netChargeEngine = new NetChargeEngine(gl);
    this.chargeMapEngine = new ChargeMapEngine(gl);
    this.tileMapEngine = new TileMapEngine(gl);
    this.viewEngine = new ViewEngine(gl);
    this.moveEngine = new MoveEngine(gl);
    this.wordEngine = new WordEngine(gl);
    this.debugEngine = new DebugEngine(gl);
  }

  setViewport(width : number, height : number){
    this.width = width;
    this.height = height;
  }

  renderMap(context : RenderContext){
    this.tileMapEngine.render(
      context.triangle,
      context.mapTexture,
      context.tileMapTexture);
  }

  simulateTick(context : RenderContext, tick=this.currentTick){
    this.currentTick = tick;

    const prevousCharges = context.netChargeTextures[(tick+1)%2];
    const nextCharges = context.netChargeTextures[tick%2];

    this.netChargeEngine.render(
      context.triangle,
      prevousCharges,
      context.gatesTexture,
      nextCharges);

    const currentCharges = nextCharges;

    this.chargeMapEngine.render(
      context.triangle,
      context.netMapTexture,
      currentCharges,
      context.spriteSheetTexture,
      context.chargeMapTexture);
  }

  renderView(context : RenderContext, mapToViewportMatrix : mat3) {
    this.gl.viewport(0, 0, this.width, this.height);
    this.viewEngine.render(context, mapToViewportMatrix);
    this.wordEngine.render(context, mapToViewportMatrix);
    if('debug' in window){
      this.debugEngine.render(context.triangle, context.netChargeTextures[this.currentTick%2], mapToViewportMatrix);
    }
  }

  renderMove(context : RenderContext, mapToViewportMatrix : mat3, {top, left, right, bottom} : Box, dx : number, dy : number){
    this.moveEngine.render(context, mapToViewportMatrix, [top, left, right, bottom], dx, dy);
  }

  renderChargeMap(context : RenderContext, chargeContext : RenderContext){
    const currentCharges = chargeContext.netChargeTextures[this.currentTick%2];

    this.chargeMapEngine.render(
      context.triangle,
      context.netMapTexture,
      currentCharges,
      context.spriteSheetTexture,
      context.chargeMapTexture);
  }
}
