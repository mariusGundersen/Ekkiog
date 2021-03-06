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
import ButtonEngine from './ButtonEngine';

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
  private readonly buttonEngine: ButtonEngine;
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
    this.buttonEngine = new ButtonEngine(gl);
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

  simulateTick(context: Context, tick: number, sample: number) {
    while (this.currentTick < tick) {
      this.currentTick++;

      const s = sample - (tick - this.currentTick);
      this.renderCharges(context, s);

      this.test(context, s);
    }
  }

  test(context: Context, sample: number) {
    if (context.testDriver.samples == 0)
      return;

    if (sample > context.testDriver.samples)
      return;

    if (sample <= 0) {
      context.testDriver.testResultTexture.clear();
      this.rectangleEngine.render(context.rectangle, context.testDriver.expectedResultTexture, context.testDriver.testResultTexture);
      return;
    }

    this.testEngine.render(
      context.testDriver.testPoints,
      context.chargeMapTexture,
      context.testDriver.expectedResultTexture,
      context.testDriver.testResultTexture,
      sample - 1);
  }

  renderView(context: Context, mapToViewportMatrix: mat3, top: number) {
    this.viewport.clear(0.1, 0.1, 0.1, 1);
    this.viewEngine.render(context, this.viewport, mapToViewportMatrix);
    this.wordEngine.render(context, this.viewport, mapToViewportMatrix);
    if (context.testDriver.samples > 0)
      this.rectangleEngine.render(context.rectangle, context.testDriver.testResultTexture, this.viewport, top, 64 * window.devicePixelRatio)
    //if ((window as any)['debug']) {
    // const nextCharges = context.netChargeTextures[this.currentTick % 2];
    // this.debugEngine.render(context.triangle, nextCharges, this.viewport, mapToViewportMatrix);
    //}
  }

  private readonly moveMatrix = mat3.create();
  renderMove(context: Context, mapToViewportMatrix: mat3, { top, left, right, bottom }: Box, dx: number, dy: number) {
    mat3.translate(this.moveMatrix, mapToViewportMatrix, [dx / context.tileMapTexture.halfSize[0], dy / context.tileMapTexture.halfSize[1]]);
    this.moveEngine.render(context, this.viewport, this.moveMatrix, [top, left, right, bottom]);
    this.wordEngine.render(context, this.viewport, this.moveMatrix);
  }

  renderCharges(context: Context, sample = 0) {
    const prevousCharges = context.netChargeTextures[(this.currentTick + 1) % 2];
    const nextCharges = context.netChargeTextures[this.currentTick % 2];

    nextCharges.clear();

    this.netChargeEngine.render(
      context.triangle,
      prevousCharges,
      context.gatesTexture,
      nextCharges);

    if (sample != 0 && context.testDriver.samples > 0 && sample <= context.testDriver.samples) {
      this.buttonEngine.render(
        context.testDriver.buttonPoints,
        context.netMapTexture,
        context.testDriver.expectedResultTexture,
        nextCharges,
        sample - 1);
    }

    context.chargeMapTexture.clear();

    this.chargeMapEngine.render(
      context.triangle,
      context.netMapTexture,
      nextCharges,
      context.spriteSheetTexture,
      context.chargeMapTexture);
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
