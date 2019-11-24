import { mat3 } from 'gl-matrix';
import { Box } from '../editing';

import ViewEngine from './ViewEngine';
import TileMapEngine from './TileMapEngine';
import ChargeMapEngine from './ChargeMapEngine';
import NetChargeEngine from './NetChargeEngine';
import MoveEngine from './MoveEngine';
import WordEngine from './WordEngine';
import DebugEngine from './DebugEngine';
import TestEngine from './TestEngine';

import Context from './Context';
import RectangleEngine from './RectangleEngine';
import Viewport from './buffers/Viewport';

export default class Renderer {
  private readonly gl: WebGLRenderingContext;
  private currentTick: number;
  private readonly netChargeEngine: NetChargeEngine;
  private readonly chargeMapEngine: ChargeMapEngine;
  private readonly tileMapEngine: TileMapEngine;
  private readonly viewEngine: ViewEngine;
  private readonly moveEngine: MoveEngine;
  private readonly wordEngine: WordEngine;
  private readonly debugEngine: DebugEngine;
  private readonly testEngine: TestEngine;
  private readonly rectangleEngine: RectangleEngine;
  private readonly viewport: Viewport;
  constructor(gl: WebGLRenderingContext, viewport: Viewport) {
    this.gl = gl;
    this.currentTick = 0;
    this.viewport = viewport;

    this.netChargeEngine = new NetChargeEngine(gl);
    this.chargeMapEngine = new ChargeMapEngine(gl);
    this.tileMapEngine = new TileMapEngine(gl);
    this.viewEngine = new ViewEngine(gl);
    this.moveEngine = new MoveEngine(gl);
    this.wordEngine = new WordEngine(gl);
    this.debugEngine = new DebugEngine(gl);
    this.testEngine = new TestEngine(gl);
    this.rectangleEngine = new RectangleEngine(gl);
  }

  renderMap(context: Context) {
    context.tileMapTexture.clear();

    this.tileMapEngine.render(
      context.triangle,
      context.mapTexture,
      context.tileMapTexture);
  }

  simulateTick(context: Context, tick = this.currentTick) {
    this.currentTick = tick;

    const prevousCharges = context.netChargeTextures[(tick + 1) % 2];
    const nextCharges = context.netChargeTextures[tick % 2];

    nextCharges.clear();

    this.netChargeEngine.render(
      context.triangle,
      prevousCharges,
      context.gatesTexture,
      nextCharges);

    const currentCharges = nextCharges;

    context.chargeMapTexture.clear();

    this.chargeMapEngine.render(
      context.triangle,
      context.netMapTexture,
      currentCharges,
      context.spriteSheetTexture,
      context.chargeMapTexture);
  }

  test(context: Context) {
    const chargeTexture = context.netChargeTextures[this.currentTick % 2];

    const sample = this.currentTick % context.testResultTexture.width;//0 - (output.width-1)


    if (sample == 0)
      this.viewport.clear();

    this.testEngine.render(
      context.testPoints,
      chargeTexture,
      context.expectedResultTexture,
      context.testResultTexture,
      sample);
  }

  renderView(context: Context, mapToViewportMatrix: mat3) {
    this.viewport.clear(0.1, 0.1, 0.1, 1);
    this.viewEngine.render(context, this.viewport, mapToViewportMatrix);
    this.wordEngine.render(context, this.viewport, mapToViewportMatrix);
    this.rectangleEngine.render(context.testResultRectangle, context.testResultTexture, this.viewport, this.viewport.height / window.devicePixelRatio)
    if ((window as any)['debug']) {
      this.debugEngine.render(context.triangle, context.mapTexture, this.viewport, mat3.create());
    }
  }

  private readonly moveMatrix = mat3.create();
  renderMove(context: Context, mapToViewportMatrix: mat3, { top, left, right, bottom }: Box, dx: number, dy: number) {
    mat3.translate(this.moveMatrix, mapToViewportMatrix, [dx / context.tileMapTexture.halfSize[0], dy / context.tileMapTexture.halfSize[1]]);
    this.moveEngine.render(context, this.viewport, this.moveMatrix, [top, left, right, bottom]);
    this.wordEngine.render(context, this.viewport, this.moveMatrix);
  }

  renderChargeMap(context: Context, chargeContext: Context) {
    const currentCharges = chargeContext.netChargeTextures[this.currentTick % 2];

    this.chargeMapEngine.render(
      context.triangle,
      context.netMapTexture,
      currentCharges,
      context.spriteSheetTexture,
      context.chargeMapTexture);
  }
}
